import {
  ChoiceGroup, DefaultButton, Dialog,
  DialogFooter, DialogType, IChoiceGroupOption,
  MessageBarType
} from 'office-ui-fabric-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getCloudProperties, getCurrentCloud, globalCloud,
  replaceBaseUrl, storeCloudValue
} from '../../../modules/sovereign-clouds';
import { IRootState } from '../../../types/root';
import { setActiveCloud } from '../../services/actions/cloud-action-creator';
import { setSampleQuery } from '../../services/actions/query-input-action-creators';
import { setQueryResponseStatus } from '../../services/actions/query-status-action-creator';
import { translateMessage } from '../../utils/translate-messages';
import { Sovereign } from '../../../modules/sovereign-clouds/cloud-options';

interface ISovereignCloudsProps {
  cloudSelectorOpen: boolean;
  toggleCloudSelector: Function;
  prompt?: boolean;
}

export const SovereignClouds = ({ cloudSelectorOpen, toggleCloudSelector, prompt = false }: ISovereignCloudsProps) => {
  const dispatch = useDispatch();
  const { sampleQuery, profile } = useSelector((state: IRootState) => state);

  const cloudOptions: IChoiceGroupOption[] = new Sovereign(profile).getOptions();
  const currentCloud = (getCurrentCloud() !== undefined) ? getCurrentCloud() : globalCloud;

  const handleCloudSelection = (cloud: IChoiceGroupOption) => {
    setSelectedCloud(cloud);

    dispatch(setQueryResponseStatus({
      statusText: translateMessage('Cloud selected'),
      status: cloud.key,
      ok: true,
      messageType: MessageBarType.success
    }));
  }

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: translateMessage('You have access to sovereign clouds'),
    subText: (prompt) ? `Hey there! Would you like to access your information available in another cloud?
    You will need to log in once you choose a cloud` : ''
  }

  const setSelectedCloud = (cloud: IChoiceGroupOption) => {
    let activeCloud = getCloudProperties(cloud.key) || null;
    activeCloud = (activeCloud) ? activeCloud : globalCloud;
    storeCloudValue(activeCloud.name);
    dispatch(setActiveCloud(activeCloud));

    const query = { ...sampleQuery };
    query.sampleUrl = replaceBaseUrl(query.sampleUrl);
    dispatch(setSampleQuery(query));
  }

  const dismissDialog = () => {
    const current = getCurrentCloud() || null;
    if (!current) {
      setSelectedCloud({ key: globalCloud.name, text: globalCloud.name });
    }
    toggleCloudSelector();
  }

  return (
    <Dialog
      hidden={!cloudSelectorOpen}
      onDismiss={() => dismissDialog()}
      dialogContentProps={dialogContentProps}
      modalProps={{
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
      }}
    >
      <ChoiceGroup
        label='Pick the cloud'
        defaultSelectedKey={currentCloud?.name}
        options={cloudOptions}
        onChange={(event, selectedCloud) => handleCloudSelection(selectedCloud!)}
      />
      <DialogFooter>
        <DefaultButton
          text={translateMessage('Close')}
          onClick={() => dismissDialog()} />
      </DialogFooter>
    </Dialog>
  )
}