import { MissionStatement } from '../components/MissionStatement';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

export function About() {
  return (
    <>
      <Seo pageKey="about" />
      <SectionBand tone="cream">
        <MissionStatement />
      </SectionBand>
    </>
  );
}
