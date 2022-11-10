import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmarkDto, UpdateBookmarkDto } from "./dto";
export declare class BookmarkService {
    private prisma;
    constructor(prisma: PrismaService);
    getBookmarks(userId: number): import(".prisma/client").PrismaPromise<import(".prisma/client").Bookmark[]>;
    createBookmark(userId: number, dto: CreateBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    getBookmarkById(userId: number, bookmarkId: number): Promise<import(".prisma/client").Bookmark>;
    updateBookmarkById(userId: number, bookmarkId: number, dto: UpdateBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    deleteBookmarkById(userId: number, bookmarkId: number): Promise<void>;
}
