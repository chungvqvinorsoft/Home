import classNames from "classnames/bind";
import styles from "./HomeAI.module.css";
import PropTypes from "prop-types";
import { CameraMotion, CameraMove, CameraObject } from "../../../components/Icons/HomeHeader";
const cx = classNames.bind(styles);
function HomeAI({countCamera, companyName}) {
  return (
    <div className={cx("header")}>
      <div className={cx("company-name")}>
        Thống kê Camera sử dụng dịch vụ AI của công ty{" "}
        {companyName.length === 0 ? "Vinorsoft" : companyName}
      </div>
      <div className={cx("header-wrapper")}>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            <CameraMotion />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera")}>{countCamera.MOTION}</div>
            <div className={cx("title-camera")}>Phát hiện chuyển động</div>
          </div>
        </div>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            <CameraObject />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera")}>{countCamera.COMMON_OBJECT}</div>
            <div className={cx("title-camera")}>Đối tượng phổ biến</div>
          </div>
        </div>
        <div className={cx("camera")}>
          <span className={cx("camera-icon")}>
            {" "}
            <CameraMove />
          </span>
          <div className={cx("camera-info")}>
            <div className={cx("number-camera")}>{countCamera.MOVEMENT}</div>
            <div className={cx("title-camera")}>Camera dịch chuyển</div>
          </div>
        </div>
      </div>
    </div>
  );
}

HomeAI.propTypes = {
  params: PropTypes.any,
};

export default HomeAI;
