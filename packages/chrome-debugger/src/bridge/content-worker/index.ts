import { cross } from "@/utils/global";

const CW_REQUEST_TYPE = ["RELOAD", "__"] as const;
export const CONTENT_TO_WORKER_REQUEST = CW_REQUEST_TYPE.reduce(
  (acc, cur) => ({ ...acc, [cur]: `__${cur}__CW__` }),
  {} as { [K in typeof CW_REQUEST_TYPE[number]]: `__${K}__CW__` }
);

export type CWRequestType = {
  type: typeof CONTENT_TO_WORKER_REQUEST.RELOAD;
  payload: null;
};

export class CWBridge {
  public static readonly REQUEST = CONTENT_TO_WORKER_REQUEST;
  public static readonly RESPONSE = null;

  static async postToWorker(data: CWRequestType) {
    return new Promise<null>(resolve => {
      if (cross.runtime.id) {
        cross.runtime.sendMessage(data).then(resolve);
      } else {
        resolve(null);
      }
    });
  }

  static onContentMessage(cb: (data: CWRequestType, sender: chrome.runtime.MessageSender) => null) {
    const handler = (
      message: CWRequestType,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: null) => void
    ) => {
      const rtn = cb(message, sender);
      rtn && sendResponse(rtn || null);
    };
    cross.runtime.onMessage.addListener(handler);
    return () => {
      cross.runtime.onMessage.removeListener(handler);
    };
  }
}
