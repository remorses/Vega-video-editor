import { FC } from "react";
import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";
import styled from "styled-components";
import {
  FilePlus,
  Phone,
  Photo,
  PlayerPause,
  Tex,
  Trash,
  Video,
} from "tabler-icons-react";
import { Asset } from "../interfaces/asset/Asset";
import { ImageAsset } from "../interfaces/asset/ImageAsset";
import { VideoAsset } from "../interfaces/asset/VideoAsset";
import { FontAsset } from "../interfaces/asset/FontAsset";
import { filePick } from "../pages/filePick";
import { isImageAsset } from "../rendering/updateTextEffect";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { Panel } from "./core/Panel";
import { IconButton } from "./IconButton";
import { iconProps } from "./iconProps";
import { ToolTip } from "./ToolTip";

const supportedVideoExtensions = ["mp4", "webm"];
const supportedFontExtensions = ["ttf"];
const supportedImageExtensions = ["png", "jpg", "jpeg"];

function isImage(path: string) {
  return supportedImageExtensions.some((ext) => path.endsWith(ext));
}

function isVideo(path: string) {
  return supportedVideoExtensions.some((ext) => path.endsWith(ext));
}

function isFont(path: string) {
  return supportedFontExtensions.some((ext) => path.endsWith(ext));
}

export const AssetPanel: FC = () => {
  const assets = useSelector((state) => state.scene.assets);
  const selectedAssetIds = useSelector((state) => state.scene.selectedAssetIds);
  const dispatch = useDispatch();
  const handleSelectAsset = (asset: Asset) => {
    dispatch(actions.setSelectedAssetIds([asset.id]));
  };

  const handleAddAsset = () => {
    const accept = [
      ...supportedVideoExtensions,
      ...supportedFontExtensions,
      ...supportedImageExtensions,
    ].join(", ");
    filePick((_, path) => {
      if (isFont(path)) {
        const asset: FontAsset = {
          id: uuid(),
          path: `file://${path}`,
          type: "font",
          name: path.split("/").join("_"),
        };
        dispatch(actions.updateAssets(asset));
      } else if (isVideo(path)) {
        const asset: VideoAsset = {
          id: uuid(),
          path: `file://${path}`,
          type: "video",
          name: path.split("/").join("_"),
        };
        dispatch(actions.updateAssets(asset));
      } else if (isImage(path)) {
        const asset: ImageAsset = {
          id: uuid(),
          path: `file://${path}`,
          type: "image",
          name: path.split("/").join("_"),
        };
        dispatch(actions.updateAssets(asset));
      }
    }, accept);
  };

  const handleDeleteAsset = () => {
    dispatch(actions.removeAsset(selectedAssetIds));
  };

  return (
    <Panel height={100} width={50}>
      <div
        style={{
          marginBottom: "8px",
          display: "flex",
          gap: "2px",
        }}
      >
        <IconButton onClick={handleAddAsset}>
          <FilePlus {...iconProps} />
          <ToolTip>Add new asset</ToolTip>
        </IconButton>
        <IconButton onClick={handleDeleteAsset}>
          <Trash {...iconProps} />
          <ToolTip>Delete selected asset</ToolTip>
        </IconButton>
      </div>
      {assets.map((asset) => {
        return (
          <AssetListItem
            key={asset.id}
            asset={asset}
            selected={selectedAssetIds.includes(asset.id)}
            onClick={() => handleSelectAsset(asset)}
          />
        );
      })}
    </Panel>
  );
};

const AssetListItem: FC<{
  asset: Asset;
  selected: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <Div
      tabIndex={0}
      onClick={props.onClick}
      style={{
        backgroundColor: props.selected ? "#444" : "transparent",
      }}
    >
      {props.asset.type === "video" ? (
        <Video style={{ margin: "auto 2px", minWidth: "16px" }} size={16} />
      ) : props.asset.type === "font" ? (
        <Tex style={{ margin: "auto 2px", minWidth: "16px" }} size={16} />
      ) : isImageAsset(props.asset) ? (
        <Photo style={{ margin: "auto 2px", minWidth: "16px" }} size={16} />
      ) : null}
      <div>{props.asset.name}</div>
    </Div>
  );
};

const Div = styled.div`
  display: flex;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  font-family: "Ricty Diminished";
  line-height: 16px;
  height: 16px;
  cursor: default;
  user-select: none;

  :hover {
    background-color: #333;
  }

  :focus {
    background-color: #444;
  }
`;
