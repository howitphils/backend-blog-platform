import { BlogsController } from "./routers/controllers/blogs-controller";
import { BcryptService } from "./adapters/bcryptService";
import { JwtService } from "./adapters/jwtService";
import { NodeMailerService } from "./adapters/nodemailer-service";
import { ApiCallsRepository } from "./db/mongodb/repositories/api-calls-repository/apiCalls-repository";
import { SessionRepository } from "./db/mongodb/repositories/sessions-repository/session-repository";
import { UsersRepository } from "./db/mongodb/repositories/users-repository/users-db-repository";
import { UsersQueryRepository } from "./db/mongodb/repositories/users-repository/users-query-repository";
import { EmailManager } from "./managers/email-manager";
import { AuthController } from "./routers/controllers/auth-controller";
import { AuthService } from "./services/auth-service";
import { UsersService } from "./services/users-service";
import { BlogsQueryRepository } from "./db/mongodb/repositories/blogs-repository/blogs-query-repositoy";
import { BlogsService } from "./services/blogs-service";
import { BlogsRepository } from "./db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { PostsQueryRepository } from "./db/mongodb/repositories/posts-repository/posts-query-repository";
import { PostsService } from "./services/posts-service";
import { PostsRepository } from "./db/mongodb/repositories/posts-repository/posts-db-repository";
import { CommentsController } from "./routers/controllers/comments-controller";
import { CommentsQueryRepository } from "./db/mongodb/repositories/comments-repository/comments-query-repository";
import { CommentsService } from "./services/comments-service";
import { CommentsRepository } from "./db/mongodb/repositories/comments-repository/comments-db-repository";
import { SessionService } from "./services/sessions-service";
import { SessionsQueryRepository } from "./db/mongodb/repositories/sessions-repository/sessions-query-repository";
import { PostsController } from "./routers/controllers/posts-controller";
import { SessionsController } from "./routers/controllers/sessions-controller";
import { UsersController } from "./routers/controllers/users-controller";
import { Container } from "inversify";
import { CommentLikesRepository } from "./db/mongodb/repositories/likes-repository/comment-likes/comment-like-repository";
import { PostLikesRepository } from "./db/mongodb/repositories/likes-repository/post-likes/post-like-repository";

// Dependency Injection

// // Adapters
// const bcryptService = new BcryptService();
// export const dateFnsService = new DateFnsService();
// export const jwtService = new JwtService();
// export const nodeMailerService = new NodeMailerService();
// export const uuIdService = new UuidService();
// const emailManager = new EmailManager(nodeMailerService);

// // Repositories
// export const apiCallsRepository = new ApiCallsRepository();
// const usersRepository = new UsersRepository();
// const sessionsRepository = new SessionRepository();
// const blogsRepository = new BlogsRepository();
// const postsRepository = new PostsRepository();
// const commentsRepository = new CommentsRepository();

// // Query Repositories
// const usersQueryRepository = new UsersQueryRepository();
// const blogsQueryRepository = new BlogsQueryRepository();
// const postsQueryRepository = new PostsQueryRepository();
// const commentsQueryRepository = new CommentsQueryRepository();
// const sessionsQueryRepository = new SessionsQueryRepository();

// // Services
// const blogsService = new BlogsService(blogsRepository);
// const postsService = new PostsService(postsRepository, blogsService);
// const usersService = new UsersService(
//   usersRepository,
//   bcryptService,
//   uuIdService,
//   dateFnsService
// );
// export const authService = new AuthService(
//   usersRepository,
//   sessionsRepository,
//   usersService,
//   bcryptService,
//   jwtService,
//   uuIdService,
//   emailManager,
//   dateFnsService
// );
// const commentsService = new CommentsService(
//   postsService,
//   commentsRepository,
//   usersService
// );
// const sessionsService = new SessionService(sessionsRepository);

// // Controllers
// export const authController = new AuthController(
//   authService,
//   usersQueryRepository
// );
// export const blogsController = new BlogsController(
//   blogsQueryRepository,
//   blogsService,
//   postsQueryRepository,
//   postsService
// );
// export const postsController = new PostsController(
//   postsQueryRepository,
//   postsService,
//   commentsQueryRepository,
//   commentsService
// );
// export const commentsController = new CommentsController(
//   commentsQueryRepository,
//   commentsService
// );
// export const sessionsController = new SessionsController(
//   sessionsQueryRepository,
//   sessionsService
// );
// export const usersController = new UsersController(
//   usersQueryRepository,
//   usersService
// );

// Автоматичеси создает объекты и внедряет его зависимости
export const container = new Container();

// Регистрация Класса в контейнере
// Adapters
container.bind(JwtService).to(JwtService);
container.bind(NodeMailerService).to(NodeMailerService);
container.bind(EmailManager).to(EmailManager);
container.bind(BcryptService).to(BcryptService);

// Repositories
container.bind(UsersRepository).to(UsersRepository);
container.bind(SessionRepository).to(SessionRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(ApiCallsRepository).to(ApiCallsRepository);
container.bind(CommentLikesRepository).to(CommentLikesRepository);
container.bind(PostLikesRepository).to(PostLikesRepository);

// Query Repositories
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(SessionsQueryRepository).to(SessionsQueryRepository);

// Services
container.bind(AuthService).to(AuthService);
container.bind(BlogsService).to(BlogsService);
container.bind(PostsService).to(PostsService);
container.bind(SessionService).to(SessionService);
container.bind(UsersService).to(UsersService);
container.bind(CommentsService).to(CommentsService);

// Controllers
container.bind(UsersController).to(UsersController);
container.bind(AuthController).to(AuthController);
container.bind(CommentsController).to(CommentsController);
container.bind(BlogsController).to(BlogsController);
container.bind(PostsController).to(PostsController);
container.bind(SessionsController).to(SessionsController);
