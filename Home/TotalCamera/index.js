import classNames from "classnames/bind";
import styles from './TotalCamera.module.css';
import DougNutChart from "./DougnutChart";

const cx = classNames.bind(styles)
function TotalCamera() {

    return (
        <div className={cx('total-wrapper')}>
            <div className={cx('group-camera')}>
                <div className={cx('group-camera-item')}>
                    <DougNutChart type={'group'} label={'Tổng số Camera theo nhóm'} />
                </div>
                <div className={cx('group-camera-item')}>
                    <DougNutChart type={'warehouse'} label={'Tổng số Camera theo địa điểm'} />
                </div>
            </div>
        </div>
    )
}

export default TotalCamera;