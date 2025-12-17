import { Input, Select } from "antd";
import { USER_ROLE } from "../../../../common/constants/user";
import { useTable } from "../../../../common/hooks/useTable";

const FilterUser = ()=>{
    const {onFilter} =useTable();
    return(
        <div className="flex itesm-center gap-6">
            <Input.Search 
            placeholder="Tìm kiếm theo tên, email"
            allowClear
            onChange={(e)=>{
                if(!e.target.value){
                    onFilter({search: null});
                }
            }}
            onSearch={(e) => onFilter({search: e })}
            ></Input.Search>
            <Select
            style={{
                with: 150,
            }}
            onChange={(e)=>onFilter({role : e})}
            allowClear
            placeholder="Chọn vai trò"
            options={[
                ...Object.entries(USER_ROLE).map(([value,label])=>({
                    value,
                    label,
                })),
            ]}
            />
        </div>
    )
}
export default FilterUser;