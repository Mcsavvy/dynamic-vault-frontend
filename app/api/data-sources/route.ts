import { dataSourceService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { dataSourceCreateSchema, dataSourceUpdateSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';
import { DataSourceCreateDTO } from '@/lib/services/dataSourceService';

// Get all data sources
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      // Only admins and oracles can view data sources
      if (!req.user || !req.user.roles.some(role => ['admin', 'oracle'].includes(role))) {
        return NextResponse.json(
          { error: 'Unauthorized - Insufficient permissions' },
          { status: 403 }
        );
      }

      // Get query parameters
      const url = new URL(request.url);
      const enabledOnly = url.searchParams.get('enabled') === 'true';
      
      // Get data sources
      const dataSources = await dataSourceService.getDataSources(enabledOnly ? true : undefined);

      // Format the response
      const formattedSources = dataSources.map(source => ({
        id: source._id.toString(),
        name: source.name,
        type: source.type,
        url: source.url,
        description: source.description,
        isEnabled: source.status.isEnabled,
        lastFetchAt: source.status.lastFetchAt,
        nextFetchAt: source.status.nextFetchAt,
        errorCount: source.status.errorCount,
        metrics: source.metrics,
        aiWeighting: source.aiWeighting,
        createdAt: source.createdAt,
        updatedAt: source.updatedAt
      }));

      return NextResponse.json({ dataSources: formattedSources });
    } catch (error) {
      console.error('Error fetching data sources:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create a new data source (admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth(request, async (req) => {
    try {
      // Only admins can create data sources
      if (!req.user || !req.user.roles.includes('admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
          { status: 403 }
        );
      }

      // Validate request body
      const [bodyData, validationError] = await validateBody(request, dataSourceCreateSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Create the data source
      const dataSource = await dataSourceService.createDataSource(bodyData);
      
      return NextResponse.json({
        message: 'Data source created successfully',
        dataSource: {
          id: dataSource._id.toString(),
          name: dataSource.name,
          type: dataSource.type,
          isEnabled: dataSource.status.isEnabled
        }
      }, { status: 201 });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
      
      console.error('Error creating data source:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update all data sources (bulk operation) - admin only
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      // Only admins can bulk update data sources
      if (!req.user || !req.user.roles.includes('admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
          { status: 403 }
        );
      }

      // Validate request body
      const body = await request.json();
      
      if (!body || !Array.isArray(body.dataSources)) {
        return NextResponse.json(
          { error: 'Invalid request data - dataSources array is required' },
          { status: 400 }
        );
      }

      // Process each data source update
      const results = [];
      const errors = [];
      
      for (const item of body.dataSources) {
        try {
          // Validate each update data
          const updateData = dataSourceUpdateSchema.parse(item.data);
          
          // Ensure configuration has required fields if provided
          const updateWithDefaults: Partial<DataSourceCreateDTO> = {
            ...updateData,
            // If configuration is provided but missing refreshInterval, add a default
            configuration: updateData.configuration ? {
              ...updateData.configuration,
              refreshInterval: updateData.configuration.refreshInterval ?? 3600 // Default to 1 hour
            } : undefined
          };
          
          // Update the data source
          const updated = await dataSourceService.updateDataSource(
            item.id,
            updateWithDefaults
          );
          
          if (updated) {
            results.push({
              id: updated._id.toString(),
              name: updated.name,
              success: true
            });
          } else {
            errors.push({
              id: item.id,
              error: 'Data source not found'
            });
          }
        } catch (error) {
          errors.push({
            id: item.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      return NextResponse.json({
        message: 'Bulk update completed',
        updated: results,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      console.error('Error during bulk update of data sources:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 