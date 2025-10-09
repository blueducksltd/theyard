import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Tag from "@/models/Tag";
import { CreateTagDTO, CreateTagInput, sanitizeTag } from "@/types/Tag";
import { NextRequest } from "next/server";

export const POST = errorHandler(
    async (request: NextRequest) => {
        await connectDB();

        requireAuth(request);

        const body: CreateTagInput = await request.json();
        const data = CreateTagDTO.parse(body);
        data.name = data.name.toLowerCase()

        const tagExist = await Tag.findOne({ name: data.name });
        if (tagExist) throw APIError.BadRequest(`Tag by name ${data.name} already exists`);

        const newTag = await Tag.create(data);

        if (!newTag) throw new Error("Failed to create Tag");

        return APIResponse.success("Tag created successfully", { tag: newTag }, 201);
    }
);

export const GET = errorHandler(
    async (request: NextRequest) => {
        await connectDB();

        // check query params
        const { searchParams } = new URL(request.url);
        const name = searchParams.get("name");
        const sort = searchParams.get("sort") || "createdAt";
        const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filter = {};
        if (name) Object.assign(filter, { name });
        const tags = await Tag.filter(filter, sort, direction);
        if (!tags) throw APIError.NotFound("No tags found");

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTags = tags.slice(startIndex, endIndex);
        if (paginatedTags.length === 0) return APIResponse.success("No Tags found", { Tags: [] });

        const sanitizedTags = paginatedTags.map(tag => sanitizeTag(tag));

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(tags.length / limit),
            pageSize: limit,
            totalItems: tags.length,
            nextPage: endIndex < tags.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null
        }

        return APIResponse.success("Tags retrieved successfully", { tags: sanitizedTags, pagination });
    }
);