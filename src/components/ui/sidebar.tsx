'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Settings,
  LayoutGrid,
  Table2,
  Bell,
  MessageSquare,
  FileStack,
  LineChart,
  FormInput,
  TestTube,
  ChevronDown,
  ChevronRight,
  SortAsc,
  FileSearch,
  Calendar,
  PieChart,
  Smartphone,
} from "lucide-react";

// 메뉴 항목의 타입 정의
interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuItems: MenuItem[] = [
    {
      title: "홈",
      href: "/",
      icon: <Home className="w-4 h-4" />,
    },
    {
      title: "Tabulator 그리드",
      href: "/tabulatorGrid",
      icon: <LayoutGrid className="w-4 h-4" />,
      submenu: [
        { title: "예제 1", href: "/tabulatorGrid/sample1", icon: <SortAsc className="w-4 h-4" /> },
        { title: "예제 2", href: "/tabulatorGrid/sample2", icon: <FileSearch className="w-4 h-4" /> },
        { title: "예제 3", href: "/tabulatorGrid/sample3", icon: <Calendar className="w-4 h-4" /> }
      ]
    },
    {
      title: "기타 테스트",
      href: "/other_test",
      icon: <TestTube className="w-4 h-4" />,
      submenu: [
        {
          title: "토스트 메시지",
          href: "/other_test/toast-demo",
          icon: <Bell className="w-4 h-4" />,
        },
        {
          title: "다이얼로그/모달",
          href: "/other_test/dialog-demo",
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          title: "폼 밸리데이션",
          href: "/other_test/form-validation",
          icon: <FormInput className="w-4 h-4" />,
        },
        {
          title: "데이터 필터링",
          href: "/other_test/data-filter",
          icon: <FileStack className="w-4 h-4" />,
        },
        {
          title: "스켈레톤 UI",
          href: "/other_test/skeleton-demo",
          icon: <LineChart className="w-4 h-4" />,
        },
        {
          title: "테마 전환",
          href: "/other_test/theme-toggle",
          icon: <Settings className="w-4 h-4" />,
        },
        {
          title: "멀티스텝 폼",
          href: "/other_test/multi-step-form",
          icon: <FormInput className="w-4 h-4" />,
        },
        {
          title: "드래그 앤 드롭 업로드",
          href: "/other_test/drag-drop-upload",
          icon: <FileStack className="w-4 h-4" />,
        },
        {
          title: "무한 스크롤",
          href: "/other_test/infinite-scroll",
          icon: <Smartphone className="w-4 h-4" />,
        }
      ],
    },
  ];

  // 현재 경로가 메뉴 항목의 경로와 일치하는지 확인
  const isActive = useCallback((href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }, [pathname]);

  // 메뉴 토글 함수
  const toggleMenu = useCallback((href: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  }, []);

  // 메뉴 항목 렌더링 함수
  const renderMenuItem = useCallback((item: MenuItem, level = 0) => {
    const active = isActive(item.href);
    const hasSubmenu = !!item.submenu?.length;
    const isOpen = openMenus[item.href] || (active && openMenus[item.href] !== false);
    
    const handleClick = (e: React.MouseEvent) => {
      if (hasSubmenu) {
        e.preventDefault();
        toggleMenu(item.href);
      }
    };

    // 각 메뉴 레벨에 맞는 패딩 설정
    const paddingLeft = level * 12 + 'px';

    return (
      <div key={item.href} className="mb-1">
        <div
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
            active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            "cursor-pointer"
          )}
          onClick={handleClick}
          style={{ paddingLeft: hasSubmenu ? paddingLeft : undefined }}
        >
          {hasSubmenu ? (
            <>
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
              <div className="flex items-center">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </>
          ) : (
            <Link href={item.href} className="flex w-full">
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
            </Link>
          )}
        </div>

        {hasSubmenu && isOpen && (
          <div className="mt-1 ml-4 border-l border-border pl-2">
            {item.submenu?.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  }, [isActive, openMenus, toggleMenu]);

  // 초기 메뉴 상태 설정 (페이지 로드 시)
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    
    // 현재 경로에 맞는 메뉴들을 모두 열기
    const findAndOpenMenus = (items: MenuItem[], parentPaths: string[] = []) => {
      for (const item of items) {
        if (pathname.startsWith(item.href) && item.href !== "/") {
          // 현재 메뉴 열기
          newOpenMenus[item.href] = true;
          
          // 부모 메뉴들도 모두 열기
          parentPaths.forEach(path => {
            newOpenMenus[path] = true;
          });
          
          // 서브메뉴 확인
          if (item.submenu) {
            findAndOpenMenus(item.submenu, [...parentPaths, item.href]);
          }
        } else if (item.submenu) {
          // 현재 경로와 일치하지 않더라도 서브메뉴 확인
          findAndOpenMenus(item.submenu, [...parentPaths, item.href]);
        }
      }
    };
    
    findAndOpenMenus(menuItems);
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  return (
    <div className="hidden border-r bg-card md:block md:w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="border-b p-4">
          <h1 className="text-xl font-bold">관리 시스템</h1>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <nav className="flex flex-col gap-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <div>
              <div className="text-sm font-medium">관리자</div>
              <div className="text-xs text-muted-foreground">admin@admin.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 