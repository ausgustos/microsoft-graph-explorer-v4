import { getTheme, IPivotItemProps, ITheme, PivotItem } from '@fluentui/react';
import { lazy } from 'react';
import { useAppSelector } from '../../../../store';

import { componentNames } from '../../../../telemetry';
import { ThemeContext } from '../../../../themes/theme-context';
import { Mode } from '../../../../types/enums';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import { darkThemeHostConfig, lightThemeHostConfig } from '../adaptive-cards/AdaptiveHostConfig';
import { queryResponseStyles } from '../queryResponse.styles';
import { Response } from '../response';
import { SuspenseLoader } from '../../common/lazy-loader/suspense-loader/SuspenseLoader';

const AdaptiveCard = lazy(() => import('../adaptive-cards/AdaptiveCard'));
const GraphToolkit = lazy(() => import('../graph-toolkit/GraphToolkit'));
const ResponseHeaders = lazy(() => import('../headers'));
const Snippets = lazy(() => import('../snippets'));

export const GetPivotItems = () => {

  const { graphExplorerMode: mode, sampleQuery,
    graphResponse: { body } } = useAppSelector((state) => state);

  const currentTheme: ITheme = getTheme();
  const dotStyle = queryResponseStyles(currentTheme).dot;

  function showDotIfAdaptiveCardPresent() {
    if (!!body) {
      const template = lookupTemplate(sampleQuery);
      if (template) {
        return <span style={dotStyle} />;
      }
    }
    return null;
  }

  function showDotIfGraphToolkitPresent() {
    if (!!body) {
      const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);
      if (toolkitUrl && exampleUrl) {
        validateExternalLink(toolkitUrl, componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK, null, sampleQuery);
        return <span style={dotStyle} />;
      }
    }
    return null;
  }
  function renderItemLink(
    link?: IPivotItemProps,
    defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null,
  ): JSX.Element | null {
    if (!link || !defaultRenderer) {
      return null;
    }

    return (
      <span>
        {defaultRenderer({ ...link, itemKey: 'adaptive-cards' })}
        {link.itemKey === 'adaptive-cards' && showDotIfAdaptiveCardPresent()}
        {link.itemKey === 'toolkit-component' && showDotIfGraphToolkitPresent()}
      </span>
    );
  }

  const pivotItems = [
    <PivotItem
      key='response-preview'
      ariaLabel={translateMessage('Response Preview')}
      itemIcon='Reply'
      itemKey='response-preview' // To be used to construct component name for telemetry data
      headerText={translateMessage('Response Preview')}
      title={translateMessage('Response Preview')}
      headerButtonProps={{
        'aria-controls': 'response-tab'
      }}
    >
      <div id={'response-tab'}><Response /></div>
    </PivotItem>,
    <PivotItem
      key='response-headers'
      ariaLabel={translateMessage('Response Headers')}
      headerText={translateMessage('Response Headers')}
      itemIcon='FileComment'
      itemKey='response-headers'
      title={translateMessage('Response Headers')}
      headerButtonProps={{
        'aria-controls': 'response-headers-tab'
      }}
    >
      <SuspenseLoader>
        <div id={'response-headers-tab'}><ResponseHeaders /></div>
      </SuspenseLoader>
    </PivotItem>
  ];
  if (mode === Mode.Complete) {
    pivotItems.push(
      <PivotItem
        key='code-snippets'
        ariaLabel={translateMessage('Snippets')}
        title={translateMessage('Snippets')}
        headerText={translateMessage('Snippets')}
        itemIcon='PasteAsCode'
        itemKey='code-snippets'
        headerButtonProps={{
          'aria-controls': 'code-snippets-tab'
        }}
      >
        <SuspenseLoader>
          <div id={'code-snippets-tab'}><Snippets /></div>
        </SuspenseLoader>
      </PivotItem>,
      <PivotItem
        key='graph-toolkit'
        ariaLabel={translateMessage('Graph toolkit')}
        itemIcon='CustomizeToolbar'
        itemKey='toolkit-component'
        headerText={translateMessage('Graph toolkit')}
        title={translateMessage('Graph toolkit')}
        onRenderItemLink={renderItemLink}
        headerButtonProps={{
          'aria-controls': 'toolkit-tab'
        }}
      >
        <SuspenseLoader>
          <div id={'toolkit-tab'}><GraphToolkit /></div>
        </SuspenseLoader>
      </PivotItem>,
      <PivotItem
        key='adaptive-cards'
        ariaLabel={translateMessage('Adaptive Cards')}
        headerText={translateMessage('Adaptive Cards')}
        title={translateMessage('Adaptive Cards')}
        itemIcon='ContactCard'
        itemKey='adaptive-cards'
        onRenderItemLink={renderItemLink}
        headerButtonProps={{
          'aria-controls': 'adaptive-cards-tab'
        }}
      >
        <SuspenseLoader>
          <ThemeContext.Consumer >
            {(theme) => (
              // @ts-ignore
              <div id={'adaptive-cards-tab'}>
                <AdaptiveCard
                  body={body}
                  hostConfig={theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig}
                />
              </div>
            )}
          </ThemeContext.Consumer>
        </SuspenseLoader>
      </PivotItem>
    );
  }

  return pivotItems;
};
