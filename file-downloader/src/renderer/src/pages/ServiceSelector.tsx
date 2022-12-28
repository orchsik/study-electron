import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TIpsiGubun, TIpsiYear } from '../api';

const ServiceSelector = () => {
  const location = useLocation();
  const [ipsiYearList, setIpsiYearList] = useState<TIpsiYear[]>(
    location.state.ipsiYearList
  );
  const [ipsiGubunList, setIpsiGubunList] = useState<TIpsiGubun[]>(
    location.state.ipsiGubunList
  );

  return <div></div>;
};

export default ServiceSelector;
