import { ApiError, createApiErrorResponse } from '@/server/apiError';
import { requireAuthenticatedRequest } from '@/server/auth';
import { getUserBookmarks, saveUserBookmarks } from '@/server/bookmarkStore';

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const readBookmarkPayload = async (
    request: Request
): Promise<{ categories: unknown; trash: unknown }> => {
    const payload = (await request.json().catch(() => undefined)) as unknown;

    if (!isRecord(payload) || !('categories' in payload)) {
        throw new ApiError('Bookmark payload is invalid.', 400);
    }

    return {
        categories: payload.categories,
        trash: 'trash' in payload ? payload.trash : [],
    };
};

export const GET = async (): Promise<Response> => {
    try {
        const { client, userId } = await requireAuthenticatedRequest();

        return Response.json((await getUserBookmarks(client, userId)) ?? {});
    } catch (error) {
        return createApiErrorResponse(error);
    }
};

export const POST = async (request: Request): Promise<Response> => {
    try {
        const { client, userId } = await requireAuthenticatedRequest();
        const bookmarkData = await readBookmarkPayload(request);

        return Response.json(
            await saveUserBookmarks(client, userId, bookmarkData)
        );
    } catch (error) {
        return createApiErrorResponse(error);
    }
};
