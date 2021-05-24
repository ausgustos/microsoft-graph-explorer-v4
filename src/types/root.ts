import { ICloud } from './cloud';
import { IAdaptiveCardResponse } from './adaptivecard';
import { IAutocompleteResponse } from './auto-complete';
import { IDimensions } from './dimensions';
import { Mode } from './enums';
import { IHistoryItem } from './history';
import { IScopes } from './permissions';
import { IUser } from './profile';
import { IGraphResponse } from './query-response';
import { IQuery, ISampleQuery } from './query-runner';
import { ISidebarProps } from './sidebar';
import { ISnippet } from './snippets';
import { IStatus } from './status';

export interface IRootState {
  adaptiveCard: IAdaptiveCardResponse;
  authToken: string;
  autoComplete: IAutocompleteResponse;
  cloud: ICloud;
  consentedScopes: string[];
  dimensions: IDimensions;
  graphExplorerMode: Mode;
  graphResponse: IGraphResponse;
  history: IHistoryItem[];
  isLoadingData: boolean;
  permissionsPanelOpen: boolean;
  profile: IUser | undefined | null;
  queryRunnerStatus: IStatus | null;
  responseAreaExpanded: boolean;
  sampleQuery: IQuery;
  samples: ISampleQuery[];
  scopes: IScopes;
  sidebarProperties: ISidebarProps;
  snippets: ISnippet;
  termsOfUse: boolean;
  theme: string;
}

export interface IApiFetch {
  pending: boolean;
  data: any[] | object | null | any;
  error: any | null;
}