import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

import { useFetch } from '@/utils/hooks/useFetch';

import { useMetaFileContent } from '../helpers/meta';

import MetaTimestamp from './Timstamp';

import type { MetaContent } from '../helpers/meta/types';
import type { MetaInfoTypeBase as MInfoB } from '../types.config';
import type { FileInfoWithMeta } from '../types.file';

const MetaPart = <T extends MInfoB = MInfoB>(props: {
  metaInfoTypes: T[],
  metaFile: FileInfoWithMeta | null,
  onMetaLoad?: (content: MetaContent<T>) => void,
}) => {
  const { onMetaLoad } = props;
  const { getAndParseMetaFileContent } = useMetaFileContent<T>(props);

  const { data: metaFileContentParsed } = useFetch({
    func: getAndParseMetaFileContent,
    defaultValue: null,
  });

  const MetaPartRendered = useMemo(() => {
    const metaContent = metaFileContentParsed as null | MetaContent<MInfoB>;

    if (metaContent && onMetaLoad) {
      setTimeout(() => {
        onMetaLoad(metaContent);
      });
    }
    const cs = {
      title: metaContent?.title?.innerHtmlForHeading || '',
      objective: metaContent?.objective?.html || '',
      desc: metaContent?.description?.html || '',
      developments: metaContent?.developments?.html,
      teachers: metaContent?.teachers?.list || [],
      ats: metaContent?.activity_ts?.html,
      pts: metaContent?.publish_ts?.html,
    };
    const getHtml = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });
    return (
      <div className="font-activitySans whitespace-pre-wrap">
        <div className="mb-4">
          {/** Title */}
          {cs.title && (
            <h2
              className="meta-title mb-2 text-xl font-extrabold text-green-800"
              {...getHtml(cs.title)}
            />
          )}
          {/** Objective */}
          {cs.objective && (
            <div
              className="meta-objective mb-1 mt-1 text-base font-medium text-slate-700"
              {...getHtml(cs.objective)}
            />
          )}
          {/** Objective */}
          {cs.desc && (
            <div
              className="meta-desc text-sm font-light text-slate-700"
              {...getHtml(cs.desc)}
            />
          )}
          {/** Developments */}
          {cs.developments && (
            <div
              className="meta-desc mb-2 mt-2 text-xs font-light text-slate-500"
              {...getHtml(cs.developments)}
            />
          )}
        </div>
        <div className="meta-teachers flex justify-between text-sm">
          {cs.teachers.length && (
            <ul className="mr-4 font-normal text-slate-400">
              {cs.teachers.map((tch) => (
                <li key={tch}>
                  <FontAwesomeIcon
                    className={'mr-2'}
                    icon={faChalkboardTeacher}
                  />
                  {tch}
                </li>
              ))}
            </ul>
          )}
          <ul className="text-xs font-light text-slate-300">
            {cs.ats && (
              <MetaTimestamp key="ats" ts={cs.ats} label={'Activity Date'} />
            )}
            {cs.pts && (
              <MetaTimestamp key="pts" ts={cs.pts} label={'Publish Date'} />
            )}
          </ul>
        </div>
      </div>
    );
  }, [metaFileContentParsed, onMetaLoad]);

  return MetaPartRendered;
};

export default MetaPart;
