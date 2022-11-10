import { BookmarkService } from "./bookmark.service";
import { CreateBookmarkDto, UpdateBookmarkDto } from "./dto";
export declare class BookmarkController {
    private bookmarkService;
    constructor(bookmarkService: BookmarkService);
    getBookmarks(userId: number): import(".prisma/client").PrismaPromise<import(".prisma/client").Bookmark[]>;
    createBookmark(userId: number, dto: CreateBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    getBookmarkById(userId: number, bookmarkId: number): Promise<import(".prisma/client").Bookmark>;
    updateBookmarkById(userId: number, bookmarkId: number, dto: UpdateBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    deleteBookmarkById(userId: number, bookmarkId: number): Promise<void>;
}
