import { useState } from 'react';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';

import { RecordExam } from '../modules/data/type';
import notify from '../utils/toast';

export type CheckedRecordExam = RecordExam & { checked: boolean };

const useExamSelector = ({
  originRecordExams,
}: {
  originRecordExams: RecordExam[];
}) => {
  const [recordExams, selRecordExams] = useState<CheckedRecordExam[]>(
    originRecordExams.map((item) => ({ ...item, checked: false }))
  );

  const validateSelected = (): string[] | undefined => {
    const selectedExamSetNoList = recordExams
      .filter((item) => item.checked)
      .map((item) => item.ExamSetNo);
    if (selectedExamSetNoList.length === 0) {
      notify({
        content: '고사를 1개 이상 선택해주세요.',
        type: 'warning',
      });
      return undefined;
    }
    return selectedExamSetNoList;
  };

  const onSelectionModelChange = (selectedIds: GridSelectionModel) => {
    const checkedRecordExams = recordExams.map((item) => {
      const checked = selectedIds.some((id) => id === item.ExamSetNo);
      item.checked = checked;
      return item;
    });
    selRecordExams(checkedRecordExams);
  };

  const columns: GridColDef[] = [
    { field: 'no', headerName: 'No', width: 40 },
    { field: 'type', headerName: 'type', width: 80 },
    { field: 'ExamSetNo', headerName: '고사번호', width: 250 },
    { field: 'ExamDay', headerName: '고사일', width: 140 },
    {
      field: 'stuSetCnt',
      headerName: '배정',
      width: 60,
      type: 'number',
      sortable: false,
      description: '배정인원',
    },
    {
      field: 'blobCnt',
      headerName: '파일',
      width: 60,
      type: 'number',
      sortable: false,
      description:
        '녹화파일갯수, 면접질문이 2개 이상인 경우 배정인원 보다 많을 수 있습니다.',
    },
  ];

  const rows = recordExams.map((item, idx) => {
    return {
      no: idx + 1,
      id: item.ExamSetNo,
      type: item.type,
      ExamSetNo: item.ExamSetNo,
      ExamDay: item.ExamDay,
      stuSetCnt: item.stuSetCnt,
      blobCnt: item.blobCnt,
    };
  });

  return {
    validateSelected,
    onSelectionModelChange,
    columns,
    rows,
  };
};

export default useExamSelector;
