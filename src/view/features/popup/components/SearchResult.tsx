import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useRef, useState } from "react";

import t from "../../../../i18n/Translations";
import { focusTab } from "../../../../repository/TabsRepository";
import TabItem from "../components/TabItem";
import { WindowsContext } from "../contexts/Windows";

type SearchResultProps = {
  searchText: string;
};

const SearchResult = (props: SearchResultProps) => {
  const { searchText } = props;
  const { windows } = useContext(WindowsContext);
  const tabs = windows.findTabsByTitleOrUrl(searchText);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const minIndex = 0;
      const maxIndex = tabs.length - 1;

      if (event.key === "ArrowDown") {
        setSelectedTabIndex((oldIndex) =>
          oldIndex === maxIndex ? minIndex : oldIndex + 1,
        );
      } else if (event.key === "ArrowUp") {
        setSelectedTabIndex((oldIndex) =>
          oldIndex === minIndex ? maxIndex : oldIndex - 1,
        );
      } else if (event.key === "Enter") {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        focusTab(tabs[selectedTabIndex].id);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedTabIndex, tabs]);

  const containerRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (selectedItemRef.current) {
      const windowHeight = window.innerHeight;
      const selectedItem = selectedItemRef.current;
      const { top, bottom } = selectedItem.getBoundingClientRect();

      if (top < 0 || bottom > windowHeight) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedTabIndex]);

  return (
    <>
      {tabs.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ ml: 2, textAlign: "center" }}
          >
            {t.noResultsFound}
          </Typography>
        </Box>
      )}
      {tabs.length > 0 && (
        <List
          ref={containerRef}
          sx={{ width: "100%", bgcolor: "background.paper", overflowY: "auto" }}
          disablePadding
        >
          {tabs.map((tab, i) => (
            <TabItem
              key={tab.id}
              tab={tab}
              selected={selectedTabIndex === i}
              ref={i === selectedTabIndex ? selectedItemRef : null}
            />
          ))}
        </List>
      )}
    </>
  );
};

export default SearchResult;