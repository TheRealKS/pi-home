import { CommandResult } from "./commandresult";
import { BaseMessage } from "../server";

type CommandHandler = (cmddata : BaseMessage) => CommandResult;

export interface ICommand {
    /**
     * Handles the command
     */
    handle : CommandHandler;

    /**
     * Name of the command as used in the protocol
     */
    command : string
}