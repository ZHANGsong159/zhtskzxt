<template>
    <div class="PPSMmain">
        <div class="leftList">
            <div class="leftListBox qjsm">

            </div>
            <div class="leftListBox pdsm">
                
            </div>
            <div class="leftListBox dpks">
                
            </div>

        </div>
        <div class="rightMain">
            

        </div>

    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
.PPSMmain{
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-flow: row;
    padding: 20px 0px;
    .leftList{
        width: 15%;
        height: 100%;
        padding: 0px 15px;
        border-right: 1px solid #FFFFFF26;
        .leftListBox{
            width: 100%;
            // height: 150px;
            background: #FFFFFF26;
            margin-bottom: 20px;
        }
        .qjsm{
            height: 110px;
        }
        .pdsm{
            height: 216px;
        }
        .dpks{
            height: 163px;

        }
    }
    .rightMain{
        width: 80%;
        height: 100%;
    }

}

</style>