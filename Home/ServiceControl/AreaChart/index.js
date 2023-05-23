import classNames from "classnames/bind";
import styles from "./AreaChart.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import gradient from "chartjs-plugin-gradient";
import SelectBox from "../../../../components/SelectBox";
import SelectBoxItem from "../../../../components/SelectBox/SelectBoxItem";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosClient from "../../../../services/axiosClient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  gradient
);

const cx = classNames.bind(styles);
const dayFill = [
  {
    value: 7,
    label: "7N",
  },
  {
    value: 30,
    label: "30N",
  },
  {
    value: 90,
    label: "90N",
  },
];

function AreaChart({ title, serviceCode, cameraCode }) {
  const [listLabel, setListLabel] = useState(["0", dayFill[0].label]);
  const [dataValue, setDataValue] = useState([0]);
  const [listCamera, setListCamera] = useState([]);
  const [listDataValue, setListDataValue] = useState();
  const [filter, setFilter] = useState({ camera_code: null, camera_name: null, dayLabel: dayFill[0].label, dayValue: dayFill[0].value });
  const getDataDetectAI = useCallback(async (duration, code, serviceCode) => {
    try {
      const res = await axiosClient.get('/statEventAI/get-list-stat-event-ai/', {
        params: {
          duration: duration,
          camera_code: code,
          ai_service_code: serviceCode,
        }
      })
      if(res.length > 0) {
        await axiosClient.post('statEventAI/post-add-stat-event-ai/')
      }
      return res;
    } catch (error) {
      return null
    }
  }, [])

  const getListCamera = useCallback(async () => {
    try {
      const res = await axiosClient.get('/cameraManagement/get-list-camera/?ai_already=1')
      return res
    } catch (error) {
      return null
    }
  }, [])

  const getListCameraFill = useCallback((data, camera) => {
    let array = []
    camera.forEach(item => {
      const hvCam = data.findIndex(count => count.CAMERA_CODE === item.CAMERA.CODE);
      if (hvCam >= 0) {
        array.push(item)
      }
    })
    return array
  }, [])
  // loc ra data thong ke cua camera duoc chon
  const handleFillData = useCallback((data, code, day) => {
    const dataOfCamera = data.filter(item => item.CAMERA_CODE === code);
    const data7Days = dataOfCamera.filter(item => item.DURATION === '7 DAYS');
    const data30Days = dataOfCamera.filter(item => item.DURATION === '30 DAYS');
    const data90Days = dataOfCamera.filter(item => item.DURATION === '90 DAYS');
    let dataStatistic = [];
    if (day === 7) {
      dataStatistic = [data7Days[0]];
    } else if (day === 30) {
      dataStatistic = [data7Days[0], data30Days[0]];
    } else if (day === 90) {
      dataStatistic = [data7Days[0], data30Days[0], data90Days[0]];
    }
    const values = dataStatistic.map((item) => item?.COUNT);
    setDataValue([0, ...values]);
  }, [])

  const handleChangeCamera = (code) => {
    if(code !== 'all') {
      handleFillData(listDataValue, code, filter.dayValue)
    setFilter(prev => ({ ...prev, camera_code: code }))
    }
  };

  const checkValue = (data, array) => {
    let indexData = 0;
    const arrayToSplice = [...array];
    arrayToSplice.forEach((item, index) => {
      if (item.value === data) {
        indexData = index;
      }
    });
    const fill = arrayToSplice.splice(0, indexData + 1);
    const label = fill.map((item) => {
      return item.label;
    });
    return label;
  };
  const handleClickChangeDay = useCallback(async (label, value) => {
    if (value !== filter.dayValue) {
      setFilter(prev => ({ ...prev, dayLabel: label, dayValue: value }));
      const newLabel = checkValue(value, dayFill);
      setListLabel(["0", ...newLabel]);
      handleFillData(listDataValue, filter.camera_code, value);
    }
  }, [listDataValue, filter.dayValue, filter.camera_code, handleFillData])

  const getDataFuncAllCamera = useCallback(async () => {
    const data = await getDataDetectAI(null, null, serviceCode);
    if (data && data?.length > 0) {
      const camera = await getListCamera()
      if (camera) {
        const dataFill = getListCameraFill(data, camera.data)
        setListCamera(dataFill)
        if (dataFill.length > 0) {
          setFilter(prev => ({ ...prev, camera_code: dataFill[0].CAMERA.CODE, camera_name: dataFill[0].CAMERA.NAME_CAM }))
          handleFillData(data, dataFill[0].CAMERA.CODE, 7);
        }
      }
      setListDataValue(data)
    } else {
      setDataValue(0)
    }
  }, [getDataDetectAI, getListCamera, serviceCode, handleFillData, getListCameraFill])

  const getDataFuncOneCamera = useCallback(async () => {
    const data = await getDataDetectAI(null, null, serviceCode);
    if (data && data?.length > 0) {
      setFilter(prev => ({ ...prev, camera_code: cameraCode }))
      handleFillData(data, cameraCode, 7);
      setListDataValue(data)
    } else {
      setDataValue(0)
    }
  }, [cameraCode, serviceCode, getDataDetectAI, handleFillData])

  useEffect(() => {
    const getDataFunc = async () => {
      if (cameraCode) {
        getDataFuncOneCamera()

      } else {
        getDataFuncAllCamera()
      }
    }
    getDataFunc()
  }, [cameraCode, getDataFuncAllCamera, getDataFuncOneCamera, serviceCode])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#000",
        bodyColor: "#000",
      },
    },
    width: '100%',
    maintainAspectRatio: false,
    aspectRatio: 2,
  };
  const labels = listLabel;
  const data = {
    labels,
    datasets: [
      {
        label: "Tổng",
        data: dataValue,
        gradient: {
          backgroundColor: {
            axis: "y",
            colors: {
              0: "rgba(20, 30, 210, 0)",
              100: "rgba(20, 30, 210, 0.16)",
            },
          },
          borderColor: {
            axis: "x",
            colors: {
              0: "#141ED2",
              3: "#141ED2",
            },
          },
        },
        fill: true,
        tension: 0.4
      },
    ],
  };

  return (
    <>
      <div className={cx("header")}>
        <p className={cx("text")}>{title}</p>
        <div className={cx("options")}>
          {dayFill.map((item, index) => {
            return (
              <span key={item.value}>
                <div
                  className={cx(
                    "button-options",
                    filter.dayLabel === item.label && "active"
                  )}
                  onClick={(e) =>
                    handleClickChangeDay(item.label, item.value)
                  }
                >
                  {item.label}
                </div>
              </span>
            );
          })}
        </div>
      </div>
      {!cameraCode && (
        <div className={cx("select-box")}>
          <SelectBox
            onChange={handleChangeCamera}
            values={filter.camera_name}
          >
            {listCamera.length > 0 ? listCamera.map((item) => {
              return (
                <SelectBoxItem
                  key={item.CAMERA.CODE}
                  label={item.CAMERA.NAME_CAM}
                  value={item.CAMERA.CODE}
                />
              );
            }) : (
              <SelectBoxItem
                key={'1'}
                label={'Tất cả'}
                value={'all'}
              />
            )}
          </SelectBox>
        </div>
      )}
      <div className={cx("chart")}>
        <Line
          options={options}
          data={data}
        />
      </div >
    </>
  );
}

AreaChart.propTypes = {
  title: PropTypes.string.isRequired,
  serviceCode: PropTypes.string.isRequired,
};

export default AreaChart;
