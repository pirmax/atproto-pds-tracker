import { PlcInterface } from '../interfaces/plc-interface';
import data from '../../data.json';

const getData = async (): Promise<PlcInterface[]> => {
  const dataPlc: {
    plc: PlcInterface[];
  } = data;

  return dataPlc.plc;
};

export default getData;
