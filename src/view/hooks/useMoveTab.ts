import { useCallback, useContext } from "react";

import { moveTab } from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/WindowsContext";

export const useMoveTab = (): ((
  tabId: number,
  windowId: number,
  index: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabId: number, windowId: number, index: number) => {
      await moveTab(tabId, windowId, index);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};