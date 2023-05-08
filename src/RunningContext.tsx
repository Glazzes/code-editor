import React, {createContext, Dispatch, SetStateAction, useState} from 'react';

type RunningContextProps = {
  children: React.ReactNode;
}

type ContextValue = [boolean, Dispatch<SetStateAction<boolean>>]
export const runningContext = createContext<ContextValue>({} as ContextValue);

const RunningContext: React.FC<RunningContextProps> = ({children}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  return (
    <runningContext.Provider value={[isRunning, setIsRunning]}>
        {children}
    </runningContext.Provider>
  );
};

export default RunningContext;