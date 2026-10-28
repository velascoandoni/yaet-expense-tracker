import { Button, Card, ColorPicker, Input, Table, Tooltip } from 'antd';
import { useState } from 'react';
import { useCreateExpenseTypeMutation, useGetExpenseTypesQuery, useUpdateExpenseTypeMutation } from '../redux/api/expenseTypesApi';
import { isValidString } from '../utils/basicUtils';
import EmojiChooser from './Controls/EmojiChooser';
import TypeTag from './TypeTag';
import CustomCard from './General/CustomCard';
export function ExpenseTypeSettings({

}) {
    const [createExpenseType, result] = useCreateExpenseTypeMutation()
    const [updateExpenseType, r] = useUpdateExpenseTypeMutation()

    const defaultNewType = { type_id: 0 }
    function isNew(t) {
        return t.type_id < 1
    }

    function updateType(t) {
        if (isNew(t)) return setNewType(t)

        updateExpenseType(t)

    }
    function createNewType() {
        createExpenseType(newType)
        setNewType(defaultNewType)
    }


    function isNewTypeIncomplete() {
        if (!isValidString(newType.name)) return "Name required"
        if (!isValidString(newType.emoji)) return "Emoji required"
        if (!isValidString(newType.color)) return "Color required"
        if (!isValidString(newType.text_color)) return "Text color required"

        return false

    }





    const {
        data: types
    } = useGetExpenseTypesQuery()

    const [newType, setNewType] = useState(defaultNewType)
    const columns = [
        {
            key: "type_id",
            dataIndex: "type_id",
            title: "ID",
            width:1,
        },
        {
            key: "emoji",
            dataIndex: "emoji",
            width:1,
            title: "EMOJI",
            render: (v, type) => {
                return <EmojiChooser  emoji={type.emoji} selectEmoji={(newEmoji: string) => updateType({ ...type, emoji: newEmoji })} />
            }
        },
        {
            key: "name",
            dataIndex: "name",
            title: "TIPO",
            render: (v, type) => {
                return <Input defaultValue={v} onKeyDown={(e) => e.key == "Enter" || isNew(type) ? updateType({ ...type, name: e.target.value }) : ""} />
            }
        },
        {
            key: "color",
            dataIndex: "color",
            title: "COLOR",
            width:1,
            render: (v, type) => {
                return <ColorPicker style={{width:"7em",justifyContent:"left"}} defaultValue={v} onChangeComplete={newColor => updateType({ ...type, color: newColor.toHexString() })} showText defaultFormat='hex' />
           
            }
        },
        {
            key: "text_color",
            dataIndex: "text_color",
            title: "COLOR TEXTO",
            width:1,
            render: (v, type) => {
                return <ColorPicker style={{width:"7em",justifyContent:"left"}} defaultValue={v} onChangeComplete={newColor => updateType({ ...type, text_color: newColor.toHexString() })} showText defaultFormat='hex' />
            }
        },
        {
            key: "text_color",
            dataIndex: "text_color",
            title: "PREVIEW",
            width:40,
            render: (v, type) => {
                return <>
                    <TypeTag type={type} />
                    {isNew(type) && <>
                        <Tooltip title={isNewTypeIncomplete()}>
                            <Button type="primary" name='ADD' disabled={!!isNewTypeIncomplete()} onClick={() => createNewType()}> ADD</Button>
                        </Tooltip>
                    </>
                    }
                </>
            }
        },
    ]
    const types_sorted = [...types || []].sort((a, b) => a.type_id - b.type_id) || []
    console.log([...types_sorted, newType])
    return <CustomCard bodyStyle={{ height: "100%", overflow: "hidden"}} noPadding style={{ height: "95%",width:"60%", flexGrow: 10, alignContent: "space-between", display: "flex", flexDirection: "column", padding: "0px" }}>
        <div className={`custom-table-container sticky-headers`} style={{ maxHeight: "100%" }}
        >
            <Table
                dataSource={[...types_sorted, newType]}
                rowKey={"type_id"}
                className='darkTable'
                size='small'
                columns={columns?.map(c=>{return {...c,align:"center"}})}
                scroll={{ x: 'max-content' }}
                style={{ borderCollapse: "collapse", minWidth: "1000px"}}
                pagination={false}
                rowHoverable

            />

        </div>
    </CustomCard>

}