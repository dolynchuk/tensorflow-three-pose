import { createContext } from "react";
import { ConferenceContextValues } from "./types";

export const ConferenceContext = createContext<ConferenceContextValues>({
    people: [],
});
