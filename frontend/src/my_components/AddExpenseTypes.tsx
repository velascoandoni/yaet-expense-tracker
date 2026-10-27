import EmojiPicker, { Emoji, EmojiStyle, Theme } from 'emoji-picker-react';
import { Button, Card, ColorPicker, Form, Input, Popover, Row, Select, Table, Tag, Tooltip } from 'antd'
import form from 'antd/es/form';
import { useForm, useWatch } from 'antd/es/form/Form';
import { AggregationColor } from 'antd/es/color-picker/color';
import { useCreateExpenseTypeMutation, useGetExpenseTypesQuery, useUpdateExpenseTypeMutation } from '../redux/api/expenseTypesApi';
import TypeTag from './TypeTag';
import { EmojiProperties } from 'emoji-picker-react/dist/dataUtils/DataTypes';
import EmojiChooser from './Controls/EmojiChooser';
import { useState } from 'react';
import { isValidString } from '../utils/basicUtils';
export function AddExpenseTypes({

}) {
    const [createExpenseType, result] = useCreateExpenseTypeMutation()
    const [updateExpenseType, r] = useUpdateExpenseTypeMutation()

    const defaultNewType={ type_id: 0 }
    function isNew(t) {
        return t.type_id < 1
    }

    function updateType(t) {
        if (isNew(t)) return setNewType(t)

        updateExpenseType(t)

    }
    function createNewType(){
        createExpenseType(newType)
        setNewType(defaultNewType)
    }
    

    function isNewTypeIncomplete(){
        if(!isValidString(newType.name)) return "Name required"
        if(!isValidString(newType.emoji)) return "Emoji required"
        if(!isValidString(newType.color)) return "Color required"
        if(!isValidString(newType.text_color)) return "Text color required"

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
        },
        {
            key: "emoji",
            dataIndex: "emoji",
            title: "EMOJI",
            render: (v, type) => {
                return <EmojiChooser emoji={type.emoji} selectEmoji={(newEmoji: string) => updateType({ ...type, emoji: newEmoji })} />
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
            render: (v, type) => {
                return <ColorPicker defaultValue={v} onChangeComplete={newColor => updateType({ ...type, color: newColor.toHexString() })} showText defaultFormat='hex' />
            }
        },
        {
            key: "text_color",
            dataIndex: "text_color",
            title: "COLOR TEXTO",
            render: (v, type) => {
                return <ColorPicker defaultValue={v} onChangeComplete={newColor => updateType({ ...type, text_color: newColor.toHexString() })} showText defaultFormat='hex' />
            }
        },
        {
            key: "text_color",
            dataIndex: "text_color",
            title: "PREVIEW",
            render: (v, type) => {
                return <>
                    <TypeTag type={type} />
                    {isNew(type) && <>
                    <Tooltip title={isNewTypeIncomplete()}>
                        <Button type="primary" name='ADD' disabled={!!isNewTypeIncomplete()} onClick={()=>createNewType()}> ADD</Button>
                        </Tooltip>
                    </>
                    }
                </>
            }
        },
    ]
    const types_sorted = [...types || []].sort((a, b) => a.type_id - b.type_id) || []

    console.log([...types_sorted, newType])
    return <Card>
        <Table
            dataSource={[...types_sorted, newType]}
            rowKey={"type_id"}
            className='darkTable'
            size='small'
            columns={columns}
            style={{ borderCollapse: "collapse", minWidth: "1000px" }}
            pagination={false}
            rowHoverable
        />



    </Card>

}