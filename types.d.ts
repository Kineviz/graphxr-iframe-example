/**
 * callback type
 */
type callbackType = (
  err: Error | null,
  content: any,
  message?: string | null | undefined
) => void;

/**
 * Extentd Global Type
 */
type graphXR = {
  version: string;
  injectionApiFunc: (
    funcName: "updateGraph" | "flyTo" | "updateTwinkled" | "highlightWithNodeIds" | "highlightWithEdgeIds" | 'selectWithNodeIds' | 'getNodeWithIds' | 'getNodeWithProps',
    params: any,
    iframeElement: HTMLElement
  ) => Promise;
  injectionApiCommand: (
    command:
      | ":clearGraph"
      | ":getGraphStat"
      | ":getGraph"
      | ":selected"
      | ":nearby"
      | "or neo4j query"
      | string,
    iframeElement: HTMLElement,
    params: any
  ) => Promise;
  injectionOn: (
    eventName: "change" | "select" | "nearby" | "load",
    callback: callbackType,
    iframeElement: HTMLElement,
    uniqueName: string
  ) => void;
};
