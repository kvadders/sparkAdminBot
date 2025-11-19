import {Context} from "telegraf";
import {UserInfoResponse} from "./nsfw.dto";

export enum Project {
  DeepNude = "DeepNude",
  AIDeepNudes = "AIDeepNudes",
  SwappyBot = "SwappyBot",
  DeepBot = "DeepBot",
}

export type ProjectMode = Project | null;

export interface SessionData {
  project: ProjectMode;
  currentUser?: UserInfoResponse;
  mode: "SEARCH_USER" | "EDIT_BALANCE" | "CREATE_WITHDRAW";
}

export interface MyContext extends Context {
  session: SessionData;
  match?: RegExpMatchArray;
}
