import { CommandResult } from "./commandresult";
import { BaseMessage } from "../server";

type CommandHandler = (cmddata : BaseMessage) => CommandResult;

export interface ICommand {
    handle : CommandHandler;
    command : string
}