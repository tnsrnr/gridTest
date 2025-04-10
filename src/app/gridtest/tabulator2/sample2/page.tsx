'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCopy, Copy, Clipboard, X } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  email: string;
  phone: string;
  status: string;
}

export default function TabulatorClipboardExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [selectedData, setSelectedData] = useState<string>("");

  // 샘플 데이터
  const data: Employee[] = [
    { id: 1, name: "김철수", position: "개발자", department: "개발팀", salary: 5000000, startDate: "2020-03-15", email: "kim@example.com", phone: "010-1234-5678", status: "정규직" },
    { id: 2, name: "이영희", position: "디자이너", department: "디자인팀", salary: 4800000, startDate: "2021-05-20", email: "lee@example.com", phone: "010-2345-6789", status: "정규직" },
    { id: 3, name: "박준호", position: "매니저", department: "인사팀", salary: 6200000, startDate: "2018-11-10", email: "park@example.com", phone: "010-3456-7890", status: "정규직" },
    { id: 4, name: "정미영", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2019-07-22", email: "jung@example.com", phone: "010-4567-8901", status: "정규직" },
    { id: 5, name: "강동원", position: "마케터", department: "마케팅팀", salary: 4200000, startDate: "2022-01-15", email: "kang@example.com", phone: "010-5678-9012", status: "계약직" },
    { id: 6, name: "한지민", position: "회계사", department: "재무팀", salary: 5900000, startDate: "2017-09-05", email: "han@example.com", phone: "010-6789-0123", status: "정규직" },
    { id: 7, name: "오세진", position: "주니어 개발자", department: "개발팀", salary: 3800000, startDate: "2022-06-10", email: "oh@example.com", phone: "010-7890-1234", status: "인턴" },
    { id: 8, name: "홍길동", position: "팀장", department: "경영진", salary: 8000000, startDate: "2015-04-01", email: "hong@example.com", phone: "010-8901-2345", status: "정규직" },
    { id: 9, name: "나은혜", position: "인사담당자", department: "인사팀", salary: 4500000, startDate: "2020-10-15", email: "na@example.com", phone: "010-9012-3456", status: "정규직" },
    { id: 10, name: "임지현", position: "프론트엔드 개발자", department: "개발팀", salary: 5100000, startDate: "2019-11-20", email: "lim@example.com", phone: "010-0123-4567", status: "정규직" },
    { id: 11, name: "최상철", position: "백엔드 개발자", department: "개발팀", salary: 5200000, startDate: "2019-08-15", email: "choi@example.com", phone: "010-1111-2222", status: "정규직" },
    { id: 12, name: "우현우", position: "데이터 분석가", department: "마케팅팀", salary: 5300000, startDate: "2020-02-10", email: "woo@example.com", phone: "010-2222-3333", status: "정규직" },
  ];

  // 클립보드 데이터 읽기
  const onPasteCaptured = (event: React.ClipboardEvent) => {
    if (tabulator) {
      const clipboardData = event.clipboardData.getData('text');
      setSelectedData(`붙여넣기 데이터: ${clipboardData}`);
    }
  };

  // 선택한 셀 복사 함수
  const copySelectedCells = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.copyToClipboard("range");
        setSelectedData(`선택된 셀 범위가 복사되었습니다.`);
      } catch (err) {
        console.error("복사 오류:", err);
        setSelectedData(`복사 중 오류가 발생했습니다.`);
      }
    }
  };

  // 테이블 전체 복사 함수
  const copyEntireTable = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.copyToClipboard("table");
        setSelectedData(`전체 테이블 복사 (${data.length}행)`);
      } catch (err) {
        console.error("전체 테이블 복사 오류:", err);
      }
    }
  };
  
  // 현재 볼 수 있는 데이터만 복사
  const copyVisibleData = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.copyToClipboard("visible");
        setSelectedData(`현재 보이는 데이터 복사`);
      } catch (err) {
        console.error("보이는 데이터 복사 오류:", err);
      }
    }
  };

  // 선택한 셀 영역 초기화 함수
  const clearSelection = () => {
    if (tabulator) {
      try {
        // 방법 1: tabulator API 호출로 초기화
        // @ts-ignore
        if (typeof tabulator.clearCellSelection === 'function') {
          // @ts-ignore
          tabulator.clearCellSelection();
        } else {
          // @ts-ignore
          tabulator.deselectRow();
        }
        
        // 방법 2: Tabulator 내부 DOM 요소에 초기화 트리거 이벤트 발송
        if (tableRef.current) {
          // 테이블에 직접 선택 해제 커스텀 이벤트 발송
          const clearEvent = new CustomEvent('clearCellSelection');
          tableRef.current.dispatchEvent(clearEvent);
          
          // tabulator-selected 클래스를 가진 모든 요소 찾기
          const selectedElements = tableRef.current.querySelectorAll('.tabulator-selected');
          
          // 클래스 제거
          selectedElements.forEach(el => {
            el.classList.remove('tabulator-selected');
          });
          
          // 오버레이 요소 제거
          const overlays = tableRef.current.querySelectorAll('.tabulator-range-overlay, .tabulator-range-overlay-active');
          overlays.forEach(el => el.remove());
        }
        
        setSelectedData("선택 영역이 초기화되었습니다. (MutationObserver + blur 방식)");
        console.log('샘플2: 선택 영역 초기화 실행됨');
      } catch (err) {
        console.error("선택 초기화 오류:", err);
      }
    }
  };

  // MutationObserver를 사용하여 DOM 변경 감시
  useEffect(() => {
    if (!tableRef.current) return;
    
    // 선택 영역 오버레이가 추가될 때 감지하는 observer
    const observer = new MutationObserver((mutations) => {
      // tabulator-range-overlay 클래스를 가진 요소가 추가되었는지 확인
      const hasSelectionOverlay = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node instanceof HTMLElement && 
          (node.classList.contains('tabulator-range-overlay') || 
           node.querySelector('.tabulator-range-overlay'))
        )
      );
      
      if (hasSelectionOverlay) {
        console.log('샘플2: 선택 오버레이 감지됨');
        // 선택 상태가 변경되면 selectedData 상태 업데이트
        const selectedCells = document.querySelectorAll('.tabulator-cell.tabulator-selected');
        if (selectedCells.length > 0) {
          setSelectedData(`선택된 셀: ${selectedCells.length}개 (MutationObserver 감지)`);
        }
      }
    });
    
    // DOM 변경 감시 설정
    observer.observe(tableRef.current, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['class']
    });
    
    // 컴포넌트 해제 시 observer 정리
    return () => observer.disconnect();
  }, [tableRef.current]);
  
  // 페이지를 떠날 때 blur 이벤트로 선택 해제
  useEffect(() => {
    const handleBlur = () => {
      // 현재 포커스가 테이블 내부에 있는지 확인
      const isTableFocused = document.activeElement && 
        tableRef.current && 
        tableRef.current.contains(document.activeElement);
      
      if (!isTableFocused) {
        clearSelection();
      }
    };
    
    // 페이지 전체에 blur 이벤트 추가
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearSelection();
      }
    });
    
    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleBlur);
    };
  }, []);

  // 더블 클릭으로 선택 영역 해제
  useEffect(() => {
    const handleDoubleClick = (event: MouseEvent) => {
      // 테이블 외부 더블클릭 시에만 작동
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        clearSelection();
      }
    };
    
    document.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);

  // 전역 클릭 이벤트 핸들러
  const handleGlobalClick = useCallback((event: MouseEvent) => {
    // tabulator-table 또는 하위 요소를 클릭했는지 확인
    const isTableClick = event.target instanceof Node && 
      tableRef.current && 
      (tableRef.current.contains(event.target) || 
       // 테이블 셀 또는 선택 영역 클릭 시 무시
       (event.target as Element).closest('.tabulator-cell') || 
       (event.target as Element).closest('.tabulator-range-overlay'));
    
    // 테이블 외부 클릭 시 선택 영역 초기화
    if (!isTableClick) {
      clearSelection();
    }
  }, []);

  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      // 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 5,
        height: "100%",
        
        // 범위 선택 관련 설정
        selectable: true,
        selectableRange: 1,
        selectableRangeColumns: true,
        selectableRangeRows: true,
        selectableRangeClearCells: true,

        // 편집 관련 설정
        editTriggerEvent: "dblclick",
        
        // 클립보드 관련 설정
        clipboard: true,
        clipboardCopyStyled: false,
        clipboardCopyConfig: {
          rowHeaders: false,
          columnHeaders: false,
        },
        clipboardCopyRowRange: "range",
        clipboardPasteParser: "range",
        clipboardPasteAction: "range",

        // 행 헤더 설정
        rowHeader: {
          resizable: false, 
          frozen: true, 
          width: 40, 
          hozAlign: "center", 
          formatter: "rownum", 
          cssClass: "range-header-col", 
          editor: false
        },

        // 컬럼 기본 설정
        columnDefaults: {
          headerSort: true,
          headerHozAlign: "center",
          editor: "input",
          resizable: "header",
          width: 120,
        },
        
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 60, editor: false },
          { title: "이름", field: "name", sorter: "string", headerFilter: true },
          { title: "직책", field: "position", sorter: "string", headerFilter: true },
          { title: "부서", field: "department", sorter: "string", headerFilter: true },
          { 
            title: "급여", 
            field: "salary", 
            sorter: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }
          },
          { title: "입사일", field: "startDate", sorter: "date", headerFilter: true },
          { title: "이메일", field: "email", sorter: "string" },
          { title: "전화번호", field: "phone", sorter: "string" },
          { title: "상태", field: "status", sorter: "string", headerFilter: true }
        ],
        
        // 셀 선택 시 이벤트
        // @ts-ignore
        cellSelectionChanged: function(cells, selected) {
          console.log("셀 선택 변경:", cells?.length, selected);
          if (selected && cells && cells.length > 0) {
            setSelectedData(`선택된 셀: ${cells.length}개`);
          }
        },
      });
      
      setTabulator(table);
      
      // 명시적으로 전역 이벤트 리스너를 window에 등록
      window.addEventListener('mousedown', handleGlobalClick);
    }
    
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너와 테이블 정리
      window.removeEventListener('mousedown', handleGlobalClick);
      if (tabulator) {
        tabulator.destroy();
      }
    };
  }, [handleGlobalClick]);

  return (
    <div className="container mx-auto py-6" style={{ minHeight: '100vh' }} onClick={(e) => {
      // 컨테이너 직접 클릭 시 선택 초기화 (이벤트 버블링 방지)
      if (e.currentTarget === e.target) {
        e.stopPropagation();
        clearSelection();
      }
    }}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">클립보드 기능</h1>
          <p className="text-gray-500 mt-1">셀 범위를 드래그하여 선택한 후 복사하세요. 셀을 더블클릭하면 편집 가능합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>셀 범위 선택 및 클립보드 기능</CardTitle>
            <div className="flex flex-wrap space-x-2 mt-2">
              <Button onClick={copySelectedCells} size="sm" className="mb-2">
                <Copy className="h-4 w-4 mr-2" />
                선택한 범위 복사
              </Button>
              <Button onClick={copyEntireTable} size="sm" variant="outline" className="mb-2">
                <ClipboardCopy className="h-4 w-4 mr-2" />
                전체 테이블 복사
              </Button>
              <Button onClick={copyVisibleData} size="sm" variant="outline" className="mb-2">
                <Clipboard className="h-4 w-4 mr-2" />
                보이는 데이터 복사
              </Button>
              <Button onClick={clearSelection} size="sm" variant="destructive" className="mb-2">
                <X className="h-4 w-4 mr-2" />
                선택 초기화
              </Button>
            </div>
            {selectedData && (
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedData}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-4 text-sm text-gray-500">
              <strong>사용법:</strong> 마우스로 셀 영역을 드래그하여 선택한 후 복사 버튼을 누르거나 Ctrl+C(Command+C)를 누르세요.
              다른 스프레드시트나 텍스트 편집기에 붙여넣기가 가능합니다. 셀을 더블클릭하여 편집할 수 있습니다.
              <br />
              <strong>선택 해제 방법 1:</strong> 테이블 외부 영역을 <strong>더블클릭</strong>하면 선택이 해제됩니다.
              <br />
              <strong>선택 해제 방법 2:</strong> 브라우저 탭/창의 포커스가 바뀌면 선택이 해제됩니다.
            </p>
            <div 
              ref={tableRef} 
              className="w-full h-[500px]" 
              onPaste={onPasteCaptured}
              tabIndex={0}
            ></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 