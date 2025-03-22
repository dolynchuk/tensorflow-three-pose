import { useState, ReactNode } from "react";
import { ConferenceContext } from "./ConferenceContext";
import { Person } from "./types";

type Props = {
  children: ReactNode
}

export const ConferenceProvider = ({ children }: Props) => {
  const [persons] = useState<Person[]>([]);

  return (
    <ConferenceContext.Provider
      value={{
        people: persons,
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};
