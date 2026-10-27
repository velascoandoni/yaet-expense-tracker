import { faCodeFork, faCodeMerge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Radio, Select, Table, Tag, Tooltip } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react";
import { useUpdateExpenseMutation } from "../redux/api/expensesApi";
import { useGetExpenseTypesQuery } from "../redux/api/expenseTypesApi";
import { isExpense } from "../utils/expenseUtils";
import ExpandedRowRender from "./ExpandedRowRender";
import TypeTag from "./TypeTag";

import { useLayoutEffect } from "react";
import { debounce } from "../utils/basicUtils";
import dayjs from "dayjs";

export function MainTable({
  expenses,
  mergingExpenses,
  setMerginExpenses,
  editable,
  reduced,
  selectable,
  maxHeight,
  style,
  showBalance,
  hideHeader,
  actions,
  setQuery,
}) {
  let user = JSON.parse(localStorage.getItem("user"))

  const {
    data: types
  } = useGetExpenseTypesQuery({}, {})

  const [updateExpenseApi, r] = useUpdateExpenseMutation()

  function updateExpense(expense) {
    updateExpenseApi({ ...expense, user_id: user?.user_id })
  }


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            confirm();
            setQuery((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] || "" }));
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          size="small"
          onClick={() => {
            confirm();
            setQuery((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] || "" }));
          }}
          style={{ width: "100%" }}
        >
          Search
        </Button>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),

    onFilterDropdownOpenChange(open) {
      if (open) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const getColumnSearchPropsRadio = (options = []) => ({
    filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Radio.Group
          value={selectedKeys[0]}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedKeys([value]);

            // update ONLY the radio options
            setQuery(prev => {
              const updated = { ...prev };

              // reset all the radio options
              options.forEach(opt => {
                updated[opt] = opt === value;
              });

              return updated;
            });

            confirm();
          }}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          {options.map((opt) => (
            <Radio key={opt} value={opt}>
              {opt}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    ),

    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
  });


  const columns = [
    !reduced && {
      key: "expense_id",
      dataIndex: "expense_id",
      title: "ID",
      width: "100px",
      render: (expense_id, { raw, active, split_from, merged_to, was_merged, was_split }) => {
        return <>
          {expense_id}
          {split_from && <Tooltip title={split_from}><FontAwesomeIcon icon={faCodeFork} /></Tooltip>}
          {was_merged && <Tooltip title={"MERGED"}><FontAwesomeIcon icon={faCodeMerge} /></Tooltip>}
          {merged_to && <Tooltip title={merged_to}><FontAwesomeIcon icon={faCodeMerge} style={{ rotate: "180deg" }} /></Tooltip>}
          {was_split && <Tooltip title={"SPLIT"}><FontAwesomeIcon icon={faCodeFork} style={{ rotate: "180deg" }} /></Tooltip>}




        </>
      }

    },
    {
      key: "name",
      dataIndex: "name",
      title: "GASTO",
      width: "200px",
      ...getColumnSearchProps("name"),

    },
    {
      key: "amount",
      dataIndex: "amount",
      title: "Amount",
      width: "100px",
      render: (_, { amount, expense_id }) => expense_id < 0 ? <></> : <Tag color={amount > 0 ? "green" : "red"} key={amount}>
        {amount}€
      </Tag>,
      ...getColumnSearchPropsRadio(["expense", "profit"])

    },
    {
      key: "date",
      dataIndex: "date",
      title: "Date",
      width: "100px",
      render:(v)=>dayjs(v).format("MMM DD")

    },
    !reduced && showBalance && {
      key: "final_balance",
      dataIndex: "final_balance",
      title: "Final balance",
      width: "100px",

    },
    !reduced && {
      key: "type_id",
      dataIndex: "type_id",
      title: "TIpo",
      width: "200px",
      render: (v, record) => {
        if (!isExpense(record)) return <></>
        let type = types?.find(t => t.type_id === v)

        if (!editable) return <TypeTag type={type} />
        const options = types?.map(t => ({ label: <TypeTag type={t} />, key: t.type_id, value: t.type_id }))
        return <Select
          className="whiteInput"
          classNames={{
            root:"whiteSelect",
          }}
          style={{ width: "100%" }}
          value={v}
          options={options}
          onChange={(val) => {
            updateExpense({ ...record, type_id: val })
          }}
        />
      }
    },
    actions && {
      key: "type_id",
      dataIndex: "type_id",
      title: "A.",
      width: "40px",
      render: (v, record) => {
        return <div onClick={(e) => e.stopPropagation()}>{actions(record).map(action => {
          return <Tooltip title={action.name}>
            <FontAwesomeIcon icon={action.icon} onClick={(e) => { action.onClick(); e.stopPropagation() }} />
          </Tooltip>
        })}
        </div>
      }
    }
  ].filter(Boolean);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setMerginExpenses(selectedRows)
    },
    selectedRowKeys: mergingExpenses?.map(e => e?.expense_id),
    getCheckboxProps: (record) => ({
      disabled: !record.active, // Column configuration not to be checked
    }),
  };
  function isSelected(record) {
    return mergingExpenses.find(expense => expense.expense_id == record?.expense_id)
  }

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleExpandToggle = (record) => {
    setExpandedRowKeys((prev) =>
      prev.includes(record.expense_id)
        ? prev.filter((k) => k !== record.expense_id)
        : [...prev, record.expense_id]
    );
  };


  const [lastItemIndex, setLastItemIndex] = useState(100)
  let slicedExpenses = [...expenses.slice(0, lastItemIndex)]


  const increaseLastItemIndex = useMemo(
    () => debounce((ev) => {
      setLastItemIndex(lastItemIndex + 50)

    }, 250),
    [lastItemIndex]
  );




  return <div className={`custom-table-container ${maxHeight ? "sticky-headers" : ""}`} style={{ maxHeight }}
    onScroll={(e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight + 120) {
        // Trigger your 'Load More' function here
        increaseLastItemIndex()
      }
    }}
  ><Table
      dataSource={expenses.length > 200 ? slicedExpenses : expenses}
      rowKey={"expense_id"}
      size='small'
      className="no-scrollbar darkTable mini-table"

      columns={columns}
      style={{ borderCollapse: "collapse", flexGrow: 1, ...style || {},background:"transparent"}}
      pagination={false}
      rowHoverable
      showHeader={!hideHeader}
      expandable={{
        expandedRowRender: (expense) => <ExpandedRowRender expense={expense} />,
        expandRowByClick: false, // disable default
        showExpandColumn: true,
        rowExpandable: (expense) => !expense.raw,
        expandedRowKeys,
        onExpand: (expanded, record) => handleExpandToggle(record),
      }}
      rowClassName={(v) => `${v.expense_id < 0 ? "missing" : ""} ${!v.active ? "disabled-row" : ""}`}
      rowSelection={selectable ? rowSelection : undefined}
      onRow={(record) => ({
        onClick: () => {
          if (selectable && rowSelection?.onChange && !rowSelection?.getCheckboxProps(record).disabled) {
            rowSelection.onChange([], isSelected(record) ? mergingExpenses.filter(e => e.expense_id != record?.expense_id) : [...mergingExpenses, record]);
          }
        },
        onDoubleClick: (event) => {
          event.stopPropagation();
          const table = event.currentTarget.closest('.ant-table-wrapper')?.__reactFiber$;
          // Fallback: manually expand/collapse row
          const expandedKeys = table?.memoizedProps?.expandedRowKeys || [];
          const isExpanded = expandedKeys.includes(record.expense_id);
          const onExpand = table?.memoizedProps?.onExpand;
          if (onExpand) onExpand(!isExpanded, record);
        },
      })}

    /></div>

}