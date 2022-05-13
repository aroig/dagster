import {Box, Button, ButtonLink, Colors, Dialog, DialogFooter, Icon, Tag} from '@dagster-io/ui';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {displayNameForAssetKey, tokenForAssetKey} from '../asset-graph/Utils';
import {AssetKey} from '../assets/types';

export const RunAssetKeyTags: React.FC<{
  assetKeys: AssetKey[] | null;
  clickableTags?: boolean;
}> = React.memo(({assetKeys, clickableTags}) => {
  const [showMore, setShowMore] = React.useState(false);

  if (!assetKeys || !assetKeys.length) {
    return null;
  }

  const displayed = assetKeys.slice(0, 5);
  const hidden = assetKeys.length - displayed.length;

  if (clickableTags) {
    return (
      <>
        {displayed.map((assetKey) => (
          <Link
            to={`/instance/assets/${assetKey.path.map(encodeURIComponent).join('/')}`}
            key={tokenForAssetKey(assetKey)}
          >
            <Tag intent="none" interactive icon="asset">
              {displayNameForAssetKey(assetKey)}
            </Tag>
          </Link>
        ))}
        {hidden > 0 && (
          <ButtonLink onClick={() => setShowMore(true)}>
            <Tag intent="none" icon="asset">
              {` + ${hidden} more`}
            </Tag>
          </ButtonLink>
        )}
        <Dialog
          title={'Assets in Run'}
          icon={'asset'}
          onClose={() => setShowMore(false)}
          style={{minWidth: '400px', maxWidth: '80vw', maxHeight: '70vh'}}
          isOpen={showMore}
        >
          {showMore ? (
            <Box
              padding={{vertical: 16, horizontal: 20}}
              border={{side: 'bottom', color: Colors.KeylineGray, width: 1}}
              style={{overflowY: 'auto'}}
              background={Colors.White}
            >
              {assetKeys.map((assetKey) => (
                <div key={tokenForAssetKey(assetKey)}>
                  <Link
                    to={`/instance/assets/${assetKey.path.map(encodeURIComponent).join('/')}`}
                    key={tokenForAssetKey(assetKey)}
                  >
                    {displayNameForAssetKey(assetKey)}
                  </Link>
                </div>
              ))}
            </Box>
          ) : null}
          <DialogFooter>
            <Button intent="primary" autoFocus={true} onClick={() => setShowMore(false)}>
              OK
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  }

  return (
    <Box flex={{direction: 'row', gap: 8, wrap: 'wrap', alignItems: 'center'}}>
      <Icon color={Colors.Gray400} name="asset" size={16} />
      {`${displayed.map(displayNameForAssetKey).join(', ')}${
        hidden > 0 ? ` + ${hidden} more` : ''
      }`}
    </Box>
  );
});
