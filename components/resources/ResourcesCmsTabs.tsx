import type { ReactNode } from "react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceModal } from "@/components/resources/ResourceModal";
import type { ResourceItemRecord, ResourceTabRecord } from "@/types/resources";

type TabChrome = {
  padding: string;
  activeBorders: string;
  growWhenActive: "border-t" | "border-b";
};

function tabChrome(index: number, total: number, hasNews: boolean): TabChrome {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (hasNews && isFirst) {
    return {
      padding: "pr-4 md:pr-6",
      activeBorders: "border-t border-r",
      growWhenActive: "border-b",
    };
  }

  if (isLast) {
    return {
      padding: "pl-4 md:pl-6",
      activeBorders: "border-t",
      growWhenActive: "border-t",
    };
  }

  const isFirstCms = hasNews ? index === 1 : isFirst;
  return {
    padding: isFirstCms
      ? "pl-4 pr-4 md:pl-6 md:pr-6"
      : "pl-4 pr-4 md:pl-6 md:pr-6",
    activeBorders: isFirstCms
      ? "border-t border-r border-l"
      : "border-t border-r border-l",
    growWhenActive: "border-b",
  };
}

type Props = {
  tabs: ResourceTabRecord[];
  items: ResourceItemRecord[];
  newsInsightsPanel?: ReactNode;
  initialActiveTab?: string;
};

export function ResourcesCmsTabs({
  tabs,
  items,
  newsInsightsPanel,
  initialActiveTab,
}: Props) {
  const hasNews = Boolean(newsInsightsPanel);
  const tabCount = tabs.length + (hasNews ? 1 : 0);
  const defaultActive =
    initialActiveTab ||
    (hasNews ? "news-insights" : tabs[0]?.tabKey || "governance");

  const itemsByTabKey = new Map<string, ResourceItemRecord[]>();
  for (const item of items) {
    const key = item.tab?.tabKey;
    if (!key) continue;
    const list = itemsByTabKey.get(key) ?? [];
    list.push(item);
    itemsByTabKey.set(key, list);
  }

  return (
    <section className="bg-[#E9E9D7]">
      <div className="max-w-content mx-auto md:px-10 lg:px-[100px]">
        <div
          id="resources-tabs"
          className="max-w-content my-15 flex min-w-0 flex-nowrap overflow-x-auto overflow-y-hidden scroll-mt-[calc(var(--navbar-height)+16px)] px-6 md:px-0 hide-scrollbar lg:overflow-visible touch-pan-x"
          data-active={defaultActive}
          data-tab-hashes={JSON.stringify({
            news: hasNews ? "news-insights" : undefined,
            ...Object.fromEntries(tabs.map((t) => [t.tabHashValue, t.tabKey])),
          })}
        >
          {hasNews ? (
            <div
              id="news-insights-tab"
              className="tab-button"
              data-tab-padding="pr-4 md:pr-6"
              data-tab-active-borders="border-t border-r"
              data-tab-grow-active="border-b"
            >
              <span className="whitespace-nowrap"> News &amp; Insights </span>
            </div>
          ) : null}

          {tabs.map((tab, index) => {
            const chrome = tabChrome(
              hasNews ? index + 1 : index,
              tabCount,
              hasNews,
            );
            return (
              <div
                key={tab._id}
                id={`${tab.tabKey}-tab`}
                className="tab-button"
                data-tab-padding={chrome.padding}
                data-tab-active-borders={chrome.activeBorders}
                data-tab-grow-active={chrome.growWhenActive}
                data-tab-hash={tab.tabHashValue}
              >
                <span className="whitespace-nowrap"> {tab.title} </span>
              </div>
            );
          })}

          <div id="grow-div" data-grow-default="border-b" />
        </div>

        {hasNews ? (
          <div
            id="news-insights-content"
            className="tab-content px-6 md:px-0 md:pb-20"
          >
            {newsInsightsPanel}
          </div>
        ) : null}

        {tabs.map((tab) => {
          const tabItems = [...(itemsByTabKey.get(tab.tabKey) ?? [])].sort(
            (a, b) => (a.orderRank ?? "").localeCompare(b.orderRank ?? ""),
          );
          const isSingleWide = tab.gridLayout === "singleWide";
          const isDefaultActive = !hasNews && tab.tabKey === defaultActive;
          const hidden = hasNews || !isDefaultActive;

          return (
            <div
              key={tab._id}
              id={`${tab.tabKey}-content`}
              className={`tab-content${hidden ? " hidden" : ""} grid grid-cols-1 lg:grid-cols-2 gap-4 ${
                isSingleWide ? "md:gap-16" : "md:gap-14 lg:gap-8 xl:gap-16"
              } px-6 md:px-0 md:pb-20`}
            >
              {tabItems.map((item) => (
                <div key={item._id} className="contents">
                  <ResourceCard item={item} wideCard={isSingleWide} />
                </div>
              ))}
            </div>
          );
        })}

        {items.map((item) => (
          <ResourceModal key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
