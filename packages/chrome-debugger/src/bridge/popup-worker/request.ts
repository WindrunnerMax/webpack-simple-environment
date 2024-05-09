import type { EventMapToRecord, RecordValues } from "@/utils/types";

const PW_REQUEST_TYPE = ["COPY_ALL", "__"] as const;
export const POPUP_TO_WORKER_REQUEST = PW_REQUEST_TYPE.reduce(
  (acc, cur) => ({ ...acc, [cur]: `__${cur}__PW__` }),
  {} as { [K in typeof PW_REQUEST_TYPE[number]]: `__${K}__PW__` }
);

export type PWRequestMap = {
  [POPUP_TO_WORKER_REQUEST.COPY_ALL]: null;
};

export type PWRequestType = RecordValues<
  EventMapToRecord<RecordValues<typeof POPUP_TO_WORKER_REQUEST>, PWRequestMap>
>;
