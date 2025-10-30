import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, ChevronRight, ArrowDownToLine } from "lucide-react";
import { Card } from "./common/card";
import { Button } from "./common/button";
import { Textarea } from "./common/textarea";
import { cn } from "./common/utils";
import { ImageUploader } from "./business/ImageUploader";
import { ExampleGallery } from "./business/ExampleGallery";
import { getExamplesByCategory } from "../constants/examples";
import {
  SIDEBAR_SECTIONS,
  TOOL_CONTENT,
  DEFAULT_TOOL_ID,
  DEFAULT_SECTION_ICON,
  type SidebarSectionConfig,
} from "../constants/product-tools";

interface ProductSelectionPageProps {
  onSelectProduct?: (productId: string) => void;
}

type TimerHandle = ReturnType<typeof setTimeout>;

const SIDEBAR_HOVER_DELAY = 150;
const SIDEBAR_TRANSITION_DURATION = 300;

export function ProductSelectionPage({ onSelectProduct }: ProductSelectionPageProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeToolId, setActiveToolId] = useState(DEFAULT_TOOL_ID);
  const [selectedRatio, setSelectedRatio] = useState<string>(() => {
    const initial = TOOL_CONTENT[DEFAULT_TOOL_ID]?.ratios?.[0];
    return initial ?? "";
  });
  const [isSidebarReadyForHover, setIsSidebarReadyForHover] = useState(true);
  const hasPointerInteractedRef = useRef(true);
  const hoverTimerRef = useRef<TimerHandle | null>(null);
  const transitionTimerRef = useRef<TimerHandle | null>(null);

  const activeTool = TOOL_CONTENT[activeToolId] ?? TOOL_CONTENT[DEFAULT_TOOL_ID];

  const activeSection: SidebarSectionConfig | undefined = useMemo(() => {
    return SIDEBAR_SECTIONS.find((section) => {
      if (section.id === activeToolId) return true;
      return section.children?.some((child) => child.id === activeToolId);
    });
  }, [activeToolId]);

  const SectionIcon = activeSection?.icon ?? DEFAULT_SECTION_ICON;
  const sectionLabel = activeSection?.label ?? activeTool.title;

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);
  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const scheduleMenuOpen = useCallback(
    (menuId: string, options?: { immediate?: boolean; bypassPointerGuard?: boolean }) => {
      const immediate = options?.immediate ?? false;
      const bypassPointerGuard = options?.bypassPointerGuard ?? false;
      if (!isSidebarExpanded) return;
      if (!isSidebarReadyForHover) return;
      if (!bypassPointerGuard && !hasPointerInteractedRef.current) return;
      clearHoverTimer();
      if (immediate) {
        setActiveMenuId(menuId);
        return;
      }
      hoverTimerRef.current = setTimeout(() => {
        setActiveMenuId(menuId);
        hoverTimerRef.current = null;
      }, SIDEBAR_HOVER_DELAY);
    },
    [clearHoverTimer, isSidebarExpanded, isSidebarReadyForHover],
  );

  const scheduleMenuClose = useCallback(
    (menuId: string) => {
      clearHoverTimer();
      hoverTimerRef.current = setTimeout(() => {
        setActiveMenuId((current) => (current === menuId ? null : current));
        hoverTimerRef.current = null;
      }, SIDEBAR_HOVER_DELAY);
    },
    [clearHoverTimer],
  );

  const handleSelectTool = useCallback(
    (toolId: string, targetProductId?: string) => {
      setActiveToolId(toolId);
      onSelectProduct?.(targetProductId ?? toolId);
    },
    [onSelectProduct],
  );

  const toggleSidebar = useCallback(() => {
    clearHoverTimer();
    setIsSidebarExpanded((expanded) => {
      const next = !expanded;
      if (!next) {
        setActiveMenuId(null);
        setIsSidebarReadyForHover(true);
        clearTransitionTimer();
        hasPointerInteractedRef.current = true;
      } else {
        setIsSidebarReadyForHover(false);
        hasPointerInteractedRef.current = false;
        clearTransitionTimer();
        transitionTimerRef.current = setTimeout(() => {
          setIsSidebarReadyForHover(true);
          transitionTimerRef.current = null;
        }, SIDEBAR_TRANSITION_DURATION);
      }
      return next;
    });
  }, [clearHoverTimer, clearTransitionTimer]);

  useEffect(
    () => () => {
      clearHoverTimer();
      clearTransitionTimer();
    },
    [clearHoverTimer, clearTransitionTimer],
  );

  useEffect(() => {
    if (!isSidebarExpanded) {
      setActiveMenuId(null);
      setIsSidebarReadyForHover(true);
      clearTransitionTimer();
      hasPointerInteractedRef.current = true;
    }
  }, [clearTransitionTimer, isSidebarExpanded]);

  const registerPointerInteraction = useCallback(() => {
    hasPointerInteractedRef.current = true;
  }, []);

  useEffect(() => {
    const ratios = TOOL_CONTENT[activeToolId]?.ratios ?? [];
    if (!ratios.length) {
      setSelectedRatio("");
      return;
    }
    setSelectedRatio((current) => (ratios.includes(current) ? current : ratios[0]));
  }, [activeToolId]);

  return (
    <div className="flex-1 flex overflow-visible relative">
      <aside
        id="sidebar-workbench"
        className={cn(
          "fixed left-0 top-[73px] bottom-0 hidden bg-card border-r border-border shadow-lg z-40 transition-all duration-300 ease-in-out md:flex md:flex-col md:overflow-visible dark:shadow-none",
          isSidebarExpanded ? "w-64" : "w-16",
        )}
      >
        <div className={isSidebarExpanded ? "p-4" : "py-4 px-2"}>
          <div
            className={cn(
              "mb-6 h-8 flex items-center transition-all duration-300",
              isSidebarExpanded ? "gap-2" : "justify-center",
            )}
          >
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={isSidebarExpanded}
              aria-controls="sidebar-workbench"
              className={cn(
                "flex items-center justify-center rounded-lg border border-transparent bg-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] hover:bg-sidebar-accent hover:text-sidebar-accent cursor-pointer",
                isSidebarExpanded ? "size-9" : "size-10",
              )}
            >
              <LayoutGrid
                className={cn(
                  "transition-all duration-200",
                  isSidebarExpanded ? "size-6" : "size-7",
                  "text-black dark:text-white",
                )}
              />
            </button>
            <h3
              className={cn(
                "text-foreground whitespace-nowrap transition-all duration-200",
                isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
              )}
            >
              产品板块
            </h3>
          </div>

          <nav
            className="flex flex-col gap-3 text-foreground overflow-visible"
            onMouseMoveCapture={registerPointerInteraction}
            onPointerDownCapture={registerPointerInteraction}
          >
            {SIDEBAR_SECTIONS.map((section) => {
              const hasChildren = Boolean(section.children?.length);
              const isActiveMenu = activeMenuId === section.id;
              const Icon = section.icon;

              return (
                <div
                  key={section.id}
                  className="relative"
                  onMouseEnter={() => hasChildren && scheduleMenuOpen(section.id)}
                  onMouseLeave={() => hasChildren && scheduleMenuClose(section.id)}
                  onFocusCapture={() => hasChildren && scheduleMenuOpen(section.id, { immediate: true })}
                  onBlurCapture={() => hasChildren && scheduleMenuClose(section.id)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (hasChildren) {
                        scheduleMenuOpen(section.id, { immediate: true, bypassPointerGuard: true });
                        return;
                      }
                      setActiveMenuId(null);
                      handleSelectTool(section.targetProductId ?? section.id, section.targetProductId);
                    }}
                    className={cn(
                      "group relative flex w-full items-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] hover:bg-sidebar-accent hover:border-sidebar-accent cursor-pointer",
                      isSidebarExpanded ? "justify-between px-3 py-3 border border-border bg-card" : "justify-center py-2",
                      !hasChildren &&
                        TOOL_CONTENT[section.id] &&
                        activeToolId === section.id &&
                        "border-[#8b5cf6] bg-[#8b5cf6]/10",
                      hasChildren && isActiveMenu && "border-[#8b5cf6] bg-[#8b5cf6]/10",
                    )}
                    title={!isSidebarExpanded ? section.label : undefined}
                    aria-current={!hasChildren && activeToolId === section.id ? "page" : undefined}
                  >
                    {isSidebarExpanded ? (
                      <span className="flex items-center gap-2 text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-sidebar-accent">
                        <Icon
                          className={cn(
                            "size-5 transition-colors duration-200",
                            "text-black dark:text-white",
                            "group-hover:text-sidebar-accent",
                          )}
                        />
                        <span className="transition-colors duration-200 group-hover:text-sidebar-accent">
                          {section.label}
                        </span>
                      </span>
                    ) : (
                      <Icon
                        className={cn(
                          "size-5 transition-colors duration-200",
                          "text-black dark:text-white",
                          "group-hover:text-sidebar-accent",
                        )}
                      />
                    )}
                    {isSidebarExpanded && hasChildren && (
                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform transition-colors duration-200",
                          "text-black dark:text-white",
                          "group-hover:text-sidebar-accent",
                          isActiveMenu ? "translate-x-1" : "translate-x-0",
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {hasChildren && isActiveMenu && isSidebarExpanded && (
                    <div
                      className="submenu-panel absolute top-0 z-50 w-auto rounded-2xl border border-border bg-card p-4 shadow-xl transition-transform duration-200"
                      onMouseEnter={clearHoverTimer}
                      onMouseLeave={() => scheduleMenuClose(section.id)}
                    >
                      <div className="flex flex-col gap-3">
                        {section.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const isActiveChild = activeToolId === child.id;
                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => handleSelectTool(child.id, child.targetProductId)}
                              className={cn(
                                "group flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-base font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] cursor-pointer",
                                isActiveChild && "border-[#8b5cf6] bg-[#8b5cf6]/15 text-foreground",
                              )}
                              aria-current={isActiveChild ? "page" : undefined}
                            >
                              <ChildIcon
                                className={cn(
                                  "size-4 transition-colors duration-200",
                                  "text-black dark:text-white",
                                  "group-hover:text-sidebar-accent",
                                )}
                              />
                              <span className="flex-1 text-left transition-colors duration-200 group-hover:text-sidebar-accent">
                                {child.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      <main
        className={cn(
          "flex-1 overflow-y-auto pt-24 pb-20 transition-all duration-300",
          isSidebarExpanded ? "md:ml-64" : "md:ml-16",
        )}
      >
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-8">
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center text-sidebar-accent">
                <SectionIcon className="size-7" />
              </span>
              <span className="text-4xl font-black tracking-tight text-foreground">{sectionLabel}</span>
            </div>
          </section>

          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <Card className="workbench-card-input flex-1 min-h-[520px] rounded-2xl border-border p-8 shadow-lg">
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-2 text-foreground">
                  <h2 className="text-2xl font-black font-super-bold text-foreground">{activeTool.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{activeTool.description}</p>

                <Textarea
                  placeholder={activeTool.promptPlaceholder}
                  className="min-h-20 flex-shrink-0 rounded-xl border border-border text-sm text-foreground placeholder:text-muted-foreground"
                />

                <div className="flex flex-wrap gap-3 flex-shrink-0">
                  {activeTool.ratios.map((ratio) => (
                    <Button
                      key={ratio}
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedRatio(ratio)}
                      data-selected={selectedRatio === ratio}
                      className="ratio-chip"
                    >
                      {ratio}
                    </Button>
                  ))}
                </div>

                <div className="flex-1 min-h-0">
                  <ImageUploader maxImages={activeTool.maxImages} />
                </div>

                <Button
                  type="button"
                  disabled
                  className="h-11 flex-shrink-0 rounded-xl bg-muted text-muted-foreground"
                >
                  {activeTool.primaryButton}
                </Button>
              </div>
            </Card>

            <Card className="workbench-card-output flex-1 min-h-[520px] rounded-2xl border-border p-8 shadow-lg">
              <div className="flex h-full flex-col gap-6">
                <div className="flex items-center gap-2 text-[#f97316]">
                  <h2 className="text-2xl font-black font-super-bold text-foreground">结果</h2>
                </div>
                <p className="text-sm text-muted-foreground">{activeTool.resultPlaceholder}</p>

                <div className="workbench-result-panel flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-border px-8 py-12 text-center text-sm text-muted-foreground">
                  <ArrowDownToLine className="mx-auto mb-4 size-8 text-muted-foreground" />
                  <p className="text-muted-foreground">您生成的图像或视频将显示在这里。</p>
                </div>
              </div>
            </Card>
          </div>

          <ExampleGallery examples={getExamplesByCategory(activeToolId)} />
        </div>
      </main>
    </div>
  );
}

