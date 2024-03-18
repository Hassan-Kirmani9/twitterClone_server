"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../../clients/db");
const jwt_1 = __importDefault(require("../../services/jwt"));
exports.resolvers = {
    Query: {
        verifyGoogleToken: (parent, { token }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                const googleToken = token;
                const googleOAuthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
                googleOAuthURL.searchParams.set("id_token", googleToken);
                const { data } = yield axios_1.default.get(googleOAuthURL.toString(), {
                    responseType: "json",
                });
                const user = yield db_1.prisma_client.user.findUnique({ where: { email: data.email } });
                if (!user) {
                    yield db_1.prisma_client.user.create({
                        data: {
                            email: data.email,
                            firstName: data.name,
                            LastName: data.given_name,
                            profileImage: data.picture,
                        },
                    });
                }
                const user_inDB = yield db_1.prisma_client.user.findUnique({ where: { email: data.email } });
                if (!user_inDB)
                    throw new Error("No user");
                const userToken = jwt_1.default.generateToken(user_inDB);
                return userToken;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    const axiosError = error;
                    console.error("Axios Error Details:", axiosError.message);
                    console.error("Axios Error Response:", (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data);
                }
                else {
                    console.error("Generic Error Details:", error.message);
                }
                throw error;
            }
        }),
        getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            return ctx.user;
        })
    },
};
