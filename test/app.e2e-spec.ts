import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import { AuthDto } from "src/auth/dto";
import { updateUserDto } from "src/user/dto";
import { CreateBookmarkDto, UpdateBookmarkDto } from "src/bookmark/dto";
describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl("http://localhost:3333");
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    const dto: AuthDto = {
      email: "mohamadhasanghamari@yahoo.com",
      password: "kingth14454210",
    };
    describe("Register", () => {
      it("should throw an error if email is empty", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it("should throw an error if password is empty", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it("should throw an error if no boy is provided", () => {
        return pactum.spec().post("/auth/register").expectStatus(400);
      });
      it("should register", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe("Login", () => {
      it("should throw an error if email is empty", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it("should throw an error if password is empty", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it("should throw an error if no boy is provided", () => {
        return pactum.spec().post("/auth/login").expectStatus(400);
      });
      it("should login", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody(dto)
          .expectStatus(200)
          .stores("userAccessToken", "access_token");
      });
    });
  });
  describe("User", () => {
    describe("Get me", () => {
      it("should get current user", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .expectStatus(200);
      });
    });
    describe("Update user by id", () => {
      it("should update user", () => {
        const dto: updateUserDto = {
          firstName: "MohammadHasan",
          email: "mohamadhasanghamari14@gmail.com",
        };
        return pactum
          .spec()
          .patch("/users")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe("Bookmark", () => {
    describe("Get empty bookmarks", () => {
      it("Should get empty bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe("Create bookmark", () => {
      const dto: CreateBookmarkDto = {
        title: "First bookmark",
        link: "https://www.youtube.com/watch?v=GHTA143_b-s",
      };
      it("should create bookmark", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .withBody(dto)
          .expectStatus(201)
          .stores("bookmarkId", "id");
      });
    });
    describe("Get bookmarks", () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe("Get bookmark by id", () => {
      it("should get bookmark by id", () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .expectStatus(200)
          .inspect()
          .expectBodyContains("$S{bookmarkId}");
      });
    });
    describe("Edit bookmark by id", () => {
      const dto: UpdateBookmarkDto = {
        title: "NestJs Course for Beginners - Create a REST API",
        description:
          "In this course, we build a bookmarks API from scratch using nestJs, docker, postgres, passport js, prisma, pactum and dotenv.",
      };
      it("should update bookmark by id", () => {
        return pactum
          .spec()
          .patch("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });
    describe("Delete bookmark by id", () => {
      it("should delete bookmark by id", () => {
        return pactum
          .spec()
          .delete("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .expectStatus(204);
      });

      it("should get empty bookmark", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAccessToken}",
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
