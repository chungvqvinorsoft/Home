import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.css'
import HomeHeader from './HomeHeader';
import TotalCamera from './TotalCamera';
import ServiceControl from './ServiceControl';
import HomeAI from './HomaAI';
import streamingClient from '../../services/streamingClient';
import axiosClient from '../../services/axiosClient';
const cx = classNames.bind(styles)
function Home() {
  const [countCamera, setCountCamera] = useState({
    COUNT_CAM: 0,
    ACTIVE: 0,
    INACTIVE: 0,
    NO_CONNECT: 0,
    WEAK: 0,
    VIEWS: 0,
    COMPANY_CODE: null,
    MOTION: 0,
    COMMON_OBJECT: 0,
    MOVEMENT: 0,
  });
  const [companyName, setCompanyName] = useState("");
  const getListStatus = async () => {
    try {
      const res = await streamingClient.get(
        "/streamManagement/get-list-state-camera-stream/"
      );
      return res;
    } catch (e) { }
  };
  useEffect(() => {
    const getAndUpDateCountCamera = async () => {
      const getCountCamera = await axiosClient.get(
        "/statCountCam/get-list-stat-count-cam/"
      );
      console.log(getCountCamera);
      const status = await getListStatus();
      const noConnect = status?.filter(item => item.status === 1)
      const weak = status?.filter(item => item.status === 2)
      setCountCamera({
        NO_CONNECT: noConnect?.length,
        WEAK: weak?.length,
        COUNT_CAM: getCountCamera[0]?.COUNT_CAM,
        ACTIVE: getCountCamera[0]?.ACTIVE - noConnect?.length - weak?.length,
        INACTIVE: getCountCamera[0]?.INACTIVE,
        VIEWS: getCountCamera[0]?.VIEWS,
        COMPANY_CODE: getCountCamera[0]?.COMPANY_CODE,
        MOTION: getCountCamera[0]?.MOTION,
        COMMON_OBJECT: getCountCamera[0]?.COMMON_OBJECT,
        MOVEMENT: getCountCamera[0]?.MOVEMENT,
      });
      const getNameCompany = await axiosClient.get(
        `/company/get-list-company/?company_code=${getCountCamera[0].COMPANY_CODE}`
      );
      setCompanyName(getNameCompany[0]?.NAME);
      const upDateCountCamera = await axiosClient.post(
        "/statCountCam/post-add-stat-count-cam/"
      );
      return upDateCountCamera;
    };
    getAndUpDateCountCamera();
  }, []);
  return (
    <div className={cx('wrapper', 'grid', 'wide')}>
      <div className={cx('container')}>
        <HomeHeader companyName={companyName} countCamera={countCamera}/>
        <HomeAI companyName={companyName} countCamera={countCamera}/>
        <TotalCamera />
        <ServiceControl />
      </div>
    </div>
  )
}

export default Home;