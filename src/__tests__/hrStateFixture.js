import { wrapperFromState } from '../HrStateWrapper';

export const IDS = [
  '3QmA9amhnWoYaw',
  'ERB85xRCL1dJa6',
  '7ipxqiHrPFC6zg',
  'Bz9EiJbXa9V5ph',
  '4aeQ1dxy8ZscBn',
  '5UYmPEWaKcsUwq'
];

export default function hrStateFixture() {
  const s = wrapperFromState();

  IDS.forEach((id, i) => {
    if (i === 1) {
      s.id(id).setError({ type: 'not_found' });
    } else {
      s.id(id).set({ index: i });
    }
  });

  s.list().set(IDS);

  return s;
}
