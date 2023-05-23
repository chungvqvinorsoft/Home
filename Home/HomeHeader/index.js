import classNames from "classnames/bind";
import styles from "./HomeHeader.module.css";
import PropTypes from "prop-types";
import CameraIcon from "../../../components/Icons/IconCameras/CameraIcon";
import CameraLiveIcon from "../../../components/Icons/IconCameras/CameraLiveIcon";
import CameraOffIcon from "../../../components/Icons/IconCameras/CameraOffIcon";
import EyeBorderIcon from "../../../components/Icons/IconCameras/EyeBorderIcon";
import { LoseConnect, WeakConnect } from "../../../components/Icons/HomeHeader";
const cx = classNames.bind(styles);
function HomeHeader({countCamera, companyName}) {
  return (
    <div className={cx("header")}>
      <div className={cx("company-name")}>
        Thống kê Camera của công ty{" "}
        {companyName.length === 0 ? "Vinorsoft" : companyName}
      </div>
      <div className={cx("header-wrapper")}>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            {" "}
            <CameraIcon />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera")}>{countCamera.COUNT_CAM}</div>
            <div className={cx("title-camera")}>Tổng Camera</div>
          </div>
        </div>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            {" "}
            <CameraLiveIcon />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera", "online")}>
              {countCamera.ACTIVE}
            </div>
            <div className={cx("title-camera")}>Đang trực tuyến</div>
          </div>
        </div>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            <CameraOffIcon />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera", "offline")}>
              {countCamera.INACTIVE}
            </div>
            <div className={cx("title-camera")}>Sẵn sàng</div>
          </div>
        </div>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            <EyeBorderIcon />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera")}>{countCamera.VIEWS}</div>
            <div className={cx("title-camera")}>Lượt xem trực tiếp</div>
          </div>
        </div>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            <LoseConnect />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera", "offline")}>
              {countCamera.NO_CONNECT}
            </div>
            <div className={cx("title-camera")}>Mất kết nối</div>
          </div>
        </div>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            <WeakConnect />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera", "weak")}>
              {countCamera.WEAK}
            </div>
            <div className={cx("title-camera")}>Kết nối yếu</div>
          </div>
        </div>
      </div>
    </div>
  );
}

HomeHeader.propTypes = {
  params: PropTypes.any,
};

export default HomeHeader;
