import { HrStateWrapper } from '../HrStateWrapper';

export const IDS = [
  '3QmA9amhnWoYaw',
  'ERB85xRCL1dJa6',
  '7ipxqiHrPFC6zg',
  'Bz9EiJbXa9V5ph',
  '4aeQ1dxy8ZscBn',
  '5UYmPEWaKcsUwq'
];

export default function hrStateFixture() {
  const s = new HrStateWrapper();

  IDS.forEach((id, i) => {
    if (i === 1) {
      s.setIdError(id, { type: 'not_found' });
    } else {
      s.setById(id, { index: i });
    }
  });

  s.setList(IDS);

  return s;
}
