import { TEAM_MAP } from './team';

const NFC_LUT: Record<string, string> = {
  // Manifacturing FDM
  '4b0101004400070441a0f4230289': '/content/1',
  // Manifacturing SLA
  '4b01010044000704e13af4230289': '/content/2',
  // Manifacturing MJF
  '4b0101004400070481d6ef230289': '/content/3',

  '4b01010044000704d115f5230289': TEAM_MAP['benaja'],
  '4b010100440007042188f3230289': TEAM_MAP['sebastian'],
  '4b01010044000704b15df7230289': TEAM_MAP['timo'],
  '4b01010044000704e16af4230289': TEAM_MAP['owen']
};

export default NFC_LUT;
