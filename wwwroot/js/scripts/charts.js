class Charts {
    constructor() {
        this.storeObj = new ChartsStore();
        this.toolsObj = new ChartsBasic();

        this.toolsObj_basic = new Tools();
        this.cadastreToolsObj = new GeneralCadastre();
        //this.alToolsObj = new Al();
        this.dataToolsObj = new GeneralData();
        this.diToolsObj = new DI();
    }

    async charts(type, data = null) {
        if (type !== "projectGeneral" && type !== "project" && type !== "projectAbstract" && type !== "base") $('.loading-site').removeClass("el-hide").addClass("el-show");

        if (type === "area" || type === "provincialReport") {
            await this.charts_exploratory_area(type);
        } else if (type === "range") {
            await this.charts_cadastre(type);
        } else if (type === "dashboard_cadastre" || type === "dashboard_project") {
            await this.charts_dashboard(type);
        } else if (type === "base") {
            await this.charts_base_data(type);
        } else if (type === "project" || type === "layer") {
            await this.charts_data_devision(type);
        } else if (type === "projectGeneral") {
            await this.charts_data_projectGeneral("projectGeneral", data);
            $(".loading-site-inner[rep='projectGeneral'][type='chart']").removeClass("el-show").addClass("el-hide");
        } else if (type === "data" || type === "user" || type === "tool") {
            await this.charts_al(type);
        } else if (type === "system" || type === "DIProject" || type === "status") {
            await this.charts_di(type);
        }
        if (type !== "projectGeneral" && type !== "project" && type !== "projectAbstract" && type !== "base") $('.loading-site').removeClass("el-show").addClass("el-hide");
    }

    async charts_cadastre() {
        const provinceIdsStr = sessionStorage.getItem(`provinceIDs_range`);
        const provinceIds = provinceIdsStr != null && provinceIdsStr != "" ? provinceIdsStr.split(",") : [];

        const districtIdsStr = sessionStorage.getItem(`districtIDs_range`);
        const districtIds = districtIdsStr != null && districtIdsStr != "" ? districtIdsStr.split(",") : [];

        const conditions_rangeStr = sessionStorage.getItem("conditions_range");
        const conditions_range = conditions_rangeStr != null && conditions_rangeStr != '' ? conditions_rangeStr.split(',').map(s => parseInt(s)) : [];

        const rareaName_rangeStr = sessionStorage.getItem("rareaName_range");
        const rareaName_range = rareaName_rangeStr != null && rareaName_rangeStr != '' ? rareaName_rangeStr.split(',') : [];

        const cadastreNames_rangeStr = sessionStorage.getItem("cadastreNames_range");
        const cadastreNames_range = cadastreNames_rangeStr != null && cadastreNames_rangeStr != '' ? cadastreNames_rangeStr.split(',') : [];

        const input_range = {
            "provinceIds": provinceIds.map(i => parseInt(i)).includes(NaN) ? [] : provinceIds.map(i => parseInt(i)),
            "type": "all",
            "range": {
                "status": true,
                "summery": true,
                ...(conditions_range.length > 0 && { "conditions": conditions_range }),
                ...(rareaName_range.length > 0 && { "rareaNames": rareaName_range }),
                ...(cadastreNames_range.length > 0 && { "cadastreNames": cadastreNames_range }),
                ...(districtIds.length > 0 && { "districtIds": districtIds })
            }
        }
        const statistics = await this.cadastreToolsObj.getData(input_range);

        $('.Total-ExploratoryArea').text(`${statistics.totalExploratoryAreasCount} (${this.toolsObj.formatNumber(statistics.totalExploratoryArea)})`);
        $('.independentExploratoryArea-cadastre').text(`${statistics.independentExploratoryAreaCadastresCount}(${this.toolsObj.formatNumber(statistics.independentExploratoryAreaCadastresArea)})`)
        $('.in-process-exploratory-area').text(`${statistics.inProcessExploratoryAreasCount} (${this.toolsObj.formatNumber(statistics.inProcessExploratoryArea)})`);
        $('.Zir-PahnehArea').text(`${statistics.zirPahnehCount} (${this.toolsObj.formatNumber(statistics.zirPahnehArea)})`);
        $('.Darkhast-Parvaneh-Area').text(`${statistics.statisticsByStatus[0].cadastreCount} (${this.toolsObj.formatNumber(statistics.statisticsByStatus[0].cadastreArea)})`);
        $('.parvaneh-Kashf-Area').text(`${statistics.statisticsByStatus[1].cadastreCount} (${this.toolsObj.formatNumber(statistics.statisticsByStatus[1].cadastreArea)})`);
        $('.report-peaces-Area').text(`${statistics.statisticsByStatus[2].cadastreCount} (${this.toolsObj.formatNumber(statistics.statisticsByStatus[2].cadastreArea)})`);

        let rangeStatusChartData = this.fillChartData(`chart_rangeStatus_range`, statistics);
        try {
            await this.toolsObj.initChart(rangeStatusChartData);
        } catch (e) {
            console.log(e);
        }

        let rangeStatusYearChartData = this.fillChartData(`chart_rangeStatusYear_range`, statistics);
        try {
            await this.toolsObj.initMixedChart(rangeStatusYearChartData);
        } catch (e) {
            console.log(e);
        }

        let areaStatusChartData = this.fillChartData(`chart_areaStatus_range`, null, statistics);
        try {
            await this.toolsObj.initChart(areaStatusChartData);
        } catch (e) {
            console.log(e);
        }

        let areaStatusYearChartData = this.fillChartData(`chart_areaStatusYear_range`, statistics);
        try {
            await this.toolsObj.initMixedChart(areaStatusYearChartData);
        } catch (e) {
            console.log(e);
        }
    }

    async charts_exploratory_area(type) {
        let provinceIds = sessionStorage.getItem(`provinceID_${type}`);
        let districtIds = [];

        if (type != "provincialReport") {
            const provinceIdsStr = sessionStorage.getItem(`provinceIDs_${type}`);
            provinceIds = provinceIdsStr != null && provinceIdsStr != "" ? provinceIdsStr.split(",") : [];
            if (provinceIds.length > 0)
                provinceIds = provinceIds.map(i => parseInt(i)).includes(NaN) ? [] : provinceIds.map(i => parseInt(i));

            const districtIdsStr = sessionStorage.getItem(`districtIDs_${type}`);
            districtIds = districtIdsStr != null && districtIdsStr != "" ? districtIdsStr.split(",") : [];
            if (districtIds.length > 0)
                districtIds = districtIds.map(i => parseInt(i)).includes(NaN) ? [] : districtIds.map(i => parseInt(i)).filter((i) => i > 0);
        }
        const condition_area = sessionStorage.getItem("condition_area");

        const input_range = {
            "provinceIds": provinceIds,
            "type": "all",
            "area": {
                "status": true,
                "summery": true,
                ...(condition_area != 'none' && condition_area != 'null' && { "condition": condition_area }),
                ...(districtIds.length > 0 && { "districtIds": districtIds })
            }
        }
        const statistics = await this.cadastreToolsObj.getData(input_range);

        $('.Total-ExploratoryArea').text(`${statistics.totalExploratoryAreasCount} (${this.toolsObj.formatNumber(statistics.totalExploratoryArea)})`);
        $('.independentExploratoryArea-cadastre').text(`${statistics.independentExploratoryAreaCadastresCount}(${this.toolsObj.formatNumber(statistics.independentExploratoryAreaCadastresArea)})`)
        $('.in-process-exploratory-area').text(`${statistics.inProcessExploratoryAreasCount} (${this.toolsObj.formatNumber(statistics.inProcessExploratoryArea)})`);
        $('.Zir-PahnehArea').text(`${statistics.zirPahnehCount} (${this.toolsObj.formatNumber(statistics.zirPahnehArea)})`);
        $('.Darkhast-Parvaneh-Area').text(`${statistics.statisticsByStatus[0].cadastreCount} (${this.toolsObj.formatNumber(statistics.statisticsByStatus[0].cadastreArea)})`);
        $('.parvaneh-Kashf-Area').text(`${statistics.statisticsByStatus[1].cadastreCount} (${this.toolsObj.formatNumber(statistics.statisticsByStatus[1].cadastreArea)})`);
        $('.report-peaces-Area').text(`${statistics.statisticsByStatus[2].cadastreCount} (${this.toolsObj.formatNumber(statistics.statisticsByStatus[2].cadastreArea)})`);

        let chartData = this.fillChartData(`chart_rangeStatus_${type}`, statistics);

        try {
            await this.toolsObj.initChart(chartData);
        } catch (e) {
            console.log(e);
        }

        chartData = this.fillChartData(`chart_rangeStatusYear_${type}`, statistics);
        try {

            await this.toolsObj.initMixedChart(chartData);
        } catch (e) {
            console.log(e);
        }

        chartData = this.fillChartData(`chart_areaStatus_${type}`, null, statistics);
        try {
            await this.toolsObj.initChart(chartData);
        } catch (e) {
            console.log(e);
        }
        chartData = this.fillChartData(`chart_areaStatusYear_${type}`, statistics);
        try {
            await this.toolsObj.initMixedChart(chartData);
        } catch (e) {
            console.log(e);
        }
    }

    async charts_data_devision(type) {
        const apiCall = new GeneralDataApi();

        const sessionProvinceIds = sessionStorage.getItem('provinceIDs');
        const provinceIds = sessionProvinceIds ? sessionProvinceIds.split(",") : [];

        const projectDataFilterModal = $(".Modal-Filter[rep='project']");
        const projectIds = projectDataFilterModal.find('#project-select').val();
        const exploratoryAreaIds = projectDataFilterModal.find('#exploratory-area-select').val();
        const cadastreIds = projectDataFilterModal.find('#cadastre-select').val();
        const departmentIds = projectDataFilterModal.find('#department-select').val();

        const inputObj = {
            "ProjectIds": projectIds ? projectIds.map(id => parseInt(id)) : [],
            "ProvinceIds": provinceIds ? provinceIds.map(id => parseInt(id)) : [],
            "ExploratoryAreaIds": exploratoryAreaIds ? exploratoryAreaIds.map(id => parseInt(id)) : [],
            "CadastreIds": cadastreIds ? cadastreIds.map(id => parseInt(id)) : [],
            "DepartmentIds": departmentIds ? departmentIds.map(id => parseInt(id)) : [],
            "LayerFilesCount": null,
            "LayerFilesSize": null,
            "ArchiveFilesSize": null,
            "ArchiveFilesCount": null
        }

        const report = await apiCall.getDataByDevisionReport(inputObj);
        this.toolsObj.initReport(type, report);

        let chartData = this.fillChartData(`chart_datasCount_${type}`, null, report);
        try {
            await this.toolsObj.initGroupedChart(chartData);
        } catch (e) {
            console.log(e);
        }
    }

    async charts_base_data(type) {

        const apiCall = new GeneralDataApi();

        let scale = $('#scale-select').val();
        let category = $('#category-select').val();
        let file = $('#file-select').val();
        let departmentIds = $('.Modal-Filter #department-select').val();
        scale = scale == 'none' ? [] : [scale];
        category = category == 'none' ? [] : [category];
        file = file == 'none' ? [] : [file];
        const model = {
            "FolderNames": file,
            "CategoryNames": category,
            "ScaleNames": scale,
            "DperatmentIds": departmentIds.length > 0 ? departmentIds.map(d => parseInt(d)) : []
        };

        const report = await apiCall.getBaseDataReport(model);
        //this.toolsObj.initReport(type, report);

        let chartData = this.fillChartData(`chart_datasCount_${type}`, null, report);
        try {
            await this.toolsObj.initGroupedChart(chartData);
        } catch (e) {
            console.log(e);
        }
    }

    async charts_data_projects_count(type) {
        const apiCall = new GeneralDataApi();

        let filterModal = $(".Modal-Filter[rep='projectGeneral']");

        const sessionProvinceIds = sessionStorage.getItem('provinceIDs');
        const provinceIds = sessionProvinceIds ? sessionProvinceIds.split(",").map(id => parseInt(id)) : [];

        const projectIds = filterModal.find('#project-select').val();
        const exploratoryAreaIds = filterModal.find('#exploratory-area-select').val();
        let cadastreIds = filterModal.find('#cadastre-select').val();

        const projectManager = filterModal.find('#project-manager').val();
        const projectAdviser = filterModal.find('#project-adviser').val();
        const projectSupervisor = filterModal.find('#project-supervisor').val();
        const contractor = filterModal.find('#project-contractor').val();
        const contractStartDateFrom = filterModal.find('#contract-start-date-from').val();
        const contractStartDateTill = filterModal.find('#contract-start-date-till').val();
        const contractEndDateFrom = filterModal.find('#contract-end-date-from').val();
        const contractEndDateTill = filterModal.find('#contract-end-date-till').val();
        const projectRegion = filterModal.find('#project-region-select').val();
        const projectState = filterModal.find('#project-state-select').val();
        const rangeStatusCode = filterModal.find('#cadastre-status-select').val();
        const projectPhaseScale = filterModal.find('#project-phase-scale-select');
        var phaseScaleIds = projectPhaseScale.val().map(id => parseInt(id));

        const inputObj = {
            "ProjectIds": projectIds ? projectIds.map(i => parseInt(i)) : [],
            "ProvinceIds": provinceIds ? provinceIds.map(i => parseInt(i)) : [],
            "ExploratoryAreaIds": exploratoryAreaIds ? exploratoryAreaIds.map(i => parseInt(i)) : [],
            "CadastreIds": cadastreIds ? cadastreIds.map(i => parseInt(i)) : [],
            "ManagerId": projectManager == '' ? 0 : parseInt(projectManager),
            "AdviserId": projectAdviser == '' ? 0 : parseInt(projectAdviser),
            "SupervisorId": projectSupervisor == '' ? 0 : parseInt(projectSupervisor),
            "ContractorId": contractor == '' ? 0 : parseInt(contractor),
            "ContractStartDateTill": contractStartDateTill ? moment.from(convertDateToNumeric(contractStartDateTill), 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD') : null,
            "ContractStartDateFrom": contractStartDateFrom ? moment.from(convertDateToNumeric(contractStartDateFrom), 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD') : null,
            "ContractEndDateTill": contractEndDateTill ? moment.from(convertDateToNumeric(contractEndDateTill), 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD') : null,
            "ContractEndDateFrom": contractEndDateFrom ? moment.from(convertDateToNumeric(contractEndDateFrom), 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD') : null,
            "RegionNames": projectRegion ? projectRegion : [],
            "PhaseScaleIds": phaseScaleIds ? phaseScaleIds : [],
            "ProjectStates": projectState ? projectState : [],
            "RangeStatusCode": rangeStatusCode ? parseInt(rangeStatusCode) : 0
        }


        let chartData = this.fillChartData(`chart_finalProjectsYear_${type}`, summary);

        try {

            await this.toolsObj.initMixedChart(chartData);
        } catch (e) {
            console.log(e);
        }
        let report = await apiCall.GetProjectsCounts(inputObj);

        $('#proje-chart-count').text(this.toolsObj.formatNumber(report.projectsCount));
        $('#reg-chart-count').text(this.toolsObj.formatNumber(report.completedProjectsCount));
        $('#phas-chart-count').text(this.toolsObj.formatNumber(report.inProgressProjectsCount));
        $('#cat-chart-count').text(this.toolsObj.formatNumber(report.stoppedProjectsCount));
        $('#cancel-chart-count').text(this.toolsObj.formatNumber(report.cancelledProjectsCount));
    }


    async charts_data_projectGeneral(type, data) {
        if (data == null) {
            let formData = this.dataToolsObj.getFilterModel(ViewType.Chart, []);
            data = await this.dataToolsObj.getData_ProjectGeneral(formData);
        }
        const summary = data.projectCountPerYear;
        let chartData = this.fillChartData(`chart_finalProjectsYear_${type}`, summary);
        await this.toolsObj.initMixedChart(chartData);

        const report = data.projectCount;
        $('#proje-chart-count').text(this.toolsObj.formatNumber(report.projectsCount));
        $('#reg-chart-count').text(this.toolsObj.formatNumber(report.completedProjectsCount));
        $('#phas-chart-count').text(this.toolsObj.formatNumber(report.inProgressProjectsCount));
        $('#cat-chart-count').text(this.toolsObj.formatNumber(report.stoppedProjectsCount));
        $('#cancel-chart-count').text(this.toolsObj.formatNumber(report.cancelledProjectsCount));
    }



    async charts_al(type) {
        const apiCall = new GeneralAlApi();

        if (type === "data") {
            const statistics = await apiCall.getProjectsStatistics();
            this.toolsObj.initReport(type, statistics.projectsCount);

            $('#proje-chart-count').text(this.toolsObj.formatNumber(statistics.dataReport.projectCount));
            $('#reg-chart-count').text(this.toolsObj.formatNumber(statistics.dataReport.regionCount));
            $('#phas-chart-count').text(this.toolsObj.formatNumber(statistics.dataReport.phaseScaleCount));
            $('#cat-chart-count').text(this.toolsObj.formatNumber(statistics.dataReport.categoryCount));

            let chartData = this.fillChartData(`chart_dataType_data`, statistics.layerCountByGeometryType);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }

            chartData = this.fillChartData(`chart_provinceProject_data`, statistics.projectsCountByProvince);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }

            chartData = this.fillChartData(`chart_projectPhases_data`, statistics.projectsCountByPhaseScale);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }

            chartData = this.fillChartData(`chart_projectCategories_data`, statistics.projectsCountByCategory);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }
        }
        else if (type === "user") {
            const statistics = await apiCall.getUsersStatistics();
            $('#user-chart-count').text(this.toolsObj.formatNumber(statistics.usersCount));
            $('#dep-chart-count').text(this.toolsObj.formatNumber(statistics.departmentsCount));
            $('#group-chart-count').text(this.toolsObj.formatNumber(statistics.groupsCount));
            $('#online-chart-count').text(this.toolsObj.formatNumber(statistics.onlineUsersCount));

            let chartData = this.fillChartData(`chart_departmentUsers_user`, statistics.usersCountByDepartment);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }

            chartData = this.fillChartData(`chart_groupUsers_user`, statistics.usersCountByGroup);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }
        }
        else if (type === "tool") {
            const report = await apiCall.getAlCounts()
            this.toolsObj.initReport(type, report);

            const [subsystemCount, allTools, activePerCount] = await Promise.all(
                [
                    apiCall.getSubsystemCount(),
                    apiCall.getAllPermissionsCount(),
                    apiCall.getActivePermissionsCount()
                ]
            )
            $('#sub-chart-count').text(this.toolsObj.formatNumber(subsystemCount))
            $('#tool-chart-count').text(this.toolsObj.formatNumber(allTools))
            $('#acc-chart-count').text(this.toolsObj.formatNumber(activePerCount))

            const summary = await apiCall.getSubSystemSummary()
            let chartData = this.fillChartData(`chart_usersCount_tool`, summary);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }

            chartData = this.fillChartData(`chart_toolsCount_tool`, summary);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }
        }
    }

    async charts_di(type) {
        if (type === "system" || type === "DIProject") {
            const input = {
                "transmital": {
                    "status": true,
                    "summery": true
                }
            }
            const summary = await this.diToolsObj.getData(input);
            this.toolsObj.initReport(type, summary);

            let chartData = this.fillChartData(`chart_interactionData_${type}`, summary);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }

            chartData = this.fillChartData(`chart_sendData_${type}`, summary);
            try {
                await this.toolsObj.initChart(chartData);
            } catch (e) {
                console.log(e);
            }

            if (type == 'system') {
                //const $queryItem = $('#system-chart-wrap .item-chart canvas')
                //const $queryWrap = $('#system-chart-wrap .item-chart')
                //this.resetChart($queryItem, $queryWrap)

                chartData = this.fillChartData(`chart_sendDataYear_system`, summary);
                try {
                    await this.toolsObj.initChart(chartData);
                } catch (e) {
                    console.log(e);
                }

                chartData = this.fillChartData(`chart_recordedDataYear_system`, summary);
                try {
                    await this.toolsObj.initMultiLineChart(chartData);
                } catch (e) {
                    console.log(e);
                }
            }
            else {
                //const $queryItem = $('#system-chart-wrap2 .item-chart2 canvas')
                //const $queryWrap = $('#system-chart-wrap2 .item-chart2')
                //this.resetChart($queryItem, $queryWrap)

                chartData = this.fillChartData(`chart_acDelay_DIProject`, summary);
                try {
                    await this.toolsObj.initChart(chartData);
                } catch (e) {
                    console.log(e);
                }

                chartData = this.fillChartData(`chart_suDelay_DIProject`, summary);
                try {
                    await this.toolsObj.initChart(chartData);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        else if (type === "status") {
            //const input = {
            //    "status": {
            //        "status": true,
            //        "summery": true
            //    }
            //}
            //const report = await this.diToolsObj.getData(input);
        }
    }

    async charts_dashboard(type) {
        let provinceId = $('#province-select-').val();
        let districtId = $('#district-select-').val();
        provinceId = provinceId == 'area-table' ? "" : Number(provinceId);
        districtId = districtId == 'district-table' ? "" : Number(districtId);
        const input = {
            "provinceIds": isNaN(provinceId) || provinceId == "" ? [] : [provinceId],
            "districtIds": isNaN(districtId) || districtId == "" ? [] : [districtId],
            "statistics_dashboard": true
        }
        let summary;
        if (type === "dashboard_cadastre") {
            summary = await this.cadastreToolsObj.getData(input);
        }
        else {
            const apiCall = new GeneralAlApi()
            summary = await apiCall.GetAlCountsWithFilter({
                "ProvinceId": provinceId.toString(),
                "DistrictId": districtId.toString()
            })
        }
        this.toolsObj.initReport(type, summary);
    }

    fillChartData(type, summary = null, report = null) {

        const perConverter = { "WithoutDelay": "بدون تاخیر", "WithDelay": "دارای تاخیر" }
        const chartData = this.storeObj.charts_data[type];
        chartData.id = type;
        switch (type) {
            case "chart_rangeStatus_area":
            case "chart_rangeStatus_range":
                chartData.values = [summary.inProcessExploratoryAreasCount, summary.releasedExploratoryAreasCount];
                break;

            case "chart_rangeStatusYear_area":
            case "chart_rangeStatusYear_range":
                const discoveryCertificateCadastresCount = summary.cadastresCountByDiscoveryRegisterYear;
                const discoveryLicenseIsuueCadastresCount = summary.cadastresCountByDiscoveryLicenseIsuueYear;
                const discoveryCertificateCadastresCumulativeCount = summary.cadastresCumulativeCountByDiscoveryRegisterYear;
                const discoveryLicenseIsuueCadastresCumulativeCount = summary.cadastresCumulativeCountByDiscoveryLicenseIsuueYear;

                var projectsPerYearChartLabels = [...new Set([...discoveryCertificateCadastresCount.map(object => object.name), ...discoveryLicenseIsuueCadastresCount.map(object => object.name), ...discoveryCertificateCadastresCumulativeCount.map(object => object.name), ...discoveryLicenseIsuueCadastresCumulativeCount.map(object => object.name)])];
                projectsPerYearChartLabels.sort();
                chartData.labels = projectsPerYearChartLabels;

                let discoveryCertificateCadastresValues = [];
                let discoveryLicenseIsuueCadastresValues = [];
                let discoveryCertificateCadastresCumulativeValues = [];
                let discoveryLicenseIsuueCadastresCumulativeValues = [];
                var discoveryCertificateCadastresCumulativeLastLabel = null;
                var discoveryLicenseIsuueCadastresCumulativeLastLabel = null;
                projectsPerYearChartLabels.forEach(label => {
                    const discoveryCertificateCadastresValue = discoveryCertificateCadastresCount.find(item => item.name == label);
                    const discoveryLicenseIsuueCadastresValue = discoveryLicenseIsuueCadastresCount.find(item => item.name == label);
                    const discoveryCertificateCadastresCumulativeValue = discoveryCertificateCadastresCumulativeCount.find(item => item.name == label);
                    const discoveryLicenseIsuueCadastresCumulativeValue = discoveryLicenseIsuueCadastresCumulativeCount.find(item => item.name == label);
                    const lastLabelDiscoveryCertificateCadastresCumulativeValue = discoveryCertificateCadastresCumulativeCount.find(item => item.name == discoveryCertificateCadastresCumulativeLastLabel);
                    const lastLabelDiscoveryLicenseIsuueCadastresCumulativeValue = discoveryLicenseIsuueCadastresCumulativeCount.find(item => item.name == discoveryLicenseIsuueCadastresCumulativeLastLabel);
                    discoveryCertificateCadastresValues.push(discoveryCertificateCadastresValue ? discoveryCertificateCadastresValue.count : 0);
                    discoveryLicenseIsuueCadastresValues.push(discoveryLicenseIsuueCadastresValue ? discoveryLicenseIsuueCadastresValue.count : 0);
                    discoveryCertificateCadastresCumulativeValues.push(discoveryCertificateCadastresCumulativeValue ? discoveryCertificateCadastresCumulativeValue.count : lastLabelDiscoveryCertificateCadastresCumulativeValue ? lastLabelDiscoveryCertificateCadastresCumulativeValue.count : 0);
                    discoveryLicenseIsuueCadastresCumulativeValues.push(discoveryLicenseIsuueCadastresCumulativeValue ? discoveryLicenseIsuueCadastresCumulativeValue.count : lastLabelDiscoveryLicenseIsuueCadastresCumulativeValue ? lastLabelDiscoveryLicenseIsuueCadastresCumulativeValue.count : 0);

                    if (discoveryCertificateCadastresCumulativeValue || discoveryCertificateCadastresCumulativeLastLabel == null)
                        discoveryCertificateCadastresCumulativeLastLabel = label;
                    if (discoveryLicenseIsuueCadastresCumulativeValue || discoveryLicenseIsuueCadastresCumulativeLastLabel == null)
                        discoveryLicenseIsuueCadastresCumulativeLastLabel = label;
                })
                chartData.values = [discoveryCertificateCadastresValues, discoveryLicenseIsuueCadastresValues, discoveryCertificateCadastresCumulativeValues, discoveryLicenseIsuueCadastresCumulativeValues];
                break;



            case "chart_areaStatusYear_range":
            case "chart_areaStatusYear_area":
                const exploratoryAreasRegisterArea = summary.exploratoryAreasRegisterYear;
                const exploratoryAreasCumulativeCountByRegisterYear = summary.exploratoryAreasCumulativeCountByRegisterYear;

                var exploChartLabels = Array.from(new Set([...exploratoryAreasRegisterArea.map(object => object.name), ...exploratoryAreasCumulativeCountByRegisterYear.map(object => object.name)]));
                exploChartLabels.sort();

                let explorationDataValues = [];
                let cumulativeDataValues = [];
                let lastLabelCumulativeValue = null;

                exploChartLabels.forEach(label => {
                    const explorationValue = exploratoryAreasRegisterArea.find(item => item.name === label);
                    const cumulativeValue = exploratoryAreasCumulativeCountByRegisterYear.find(item => item.name === label);
                    const lastLabelCumulativeValueIndex = exploChartLabels.indexOf(lastLabelCumulativeValue);

                    explorationDataValues.push(explorationValue ? explorationValue.count : 0);
                    cumulativeDataValues.push(cumulativeValue ? cumulativeValue.count : (lastLabelCumulativeValueIndex !== -1 ? cumulativeDataValues[lastLabelCumulativeValueIndex] : 0));

                    if (cumulativeValue) {
                        lastLabelCumulativeValue = cumulativeValue.name;
                    }
                });

                chartData.labels = exploChartLabels;
                chartData.values = [explorationDataValues, cumulativeDataValues];
                break;

            case "chart_areaStatus_range":
            case "chart_areaStatus_area":
                chartData.values = report.statisticsByStatus.map(c => c.cadastreCount);
                break;

            case "chart_finalProjectsYear_base":
            case "chart_finalProjectsYear_projectGeneral":

                const inProgressProjectsCountPerYear = summary.inProgressProjectsCountPerYear;
                const completedProjectsCountPerYear = summary.completedProjectsCountPerYear;
                const inProgressProjectsCumulativeCountPerYear = summary.inProgressProjectsCumulativeCountPerYear;
                const completedProjectsCumulativeCountPerYear = summary.completedProjectsCumulativeCountPerYear;

                var projectsPerYearChartLabels = [...new Set([...inProgressProjectsCountPerYear.map(object => object.name), ...completedProjectsCountPerYear.map(object => object.name), ...inProgressProjectsCumulativeCountPerYear.map(object => object.name), ...completedProjectsCumulativeCountPerYear.map(object => object.name)])];

                projectsPerYearChartLabels.sort();

                chartData.labels = projectsPerYearChartLabels;

                let inProgressProjectsValues = [];
                let completedProjectsValues = [];
                let inProgressProjectsCumulativeValues = [];
                let completedProjectsCumulativeValues = [];
                var inProgressProjectsCumulativeLastLabel = null;
                var completedProjectsCumulativeLastLabel = null;
                projectsPerYearChartLabels.forEach(label => {
                    const inProgressProjectCountPerYear = inProgressProjectsCountPerYear.find(item => item.name == label);
                    const completedProjectCountPerYear = completedProjectsCountPerYear.find(item => item.name == label);
                    const inProgressProjectCumulativeCountPerYear = inProgressProjectsCumulativeCountPerYear.find(item => item.name == label);
                    const completedProjectCumulativeCountPerYear = completedProjectsCumulativeCountPerYear.find(item => item.name == label);
                    const lastLabelInProgressProjectCumulativeCountPerYear = inProgressProjectsCumulativeCountPerYear.find(item => item.name == inProgressProjectsCumulativeLastLabel);
                    const lastLabelCompletedProjectCumulativeCountPerYear = completedProjectsCumulativeCountPerYear.find(item => item.name == completedProjectsCumulativeLastLabel);

                    inProgressProjectsValues.push(inProgressProjectCountPerYear ? inProgressProjectCountPerYear.count : 0);
                    completedProjectsValues.push(completedProjectCountPerYear ? completedProjectCountPerYear.count : 0);
                    inProgressProjectsCumulativeValues.push(inProgressProjectCumulativeCountPerYear ? inProgressProjectCumulativeCountPerYear.count : lastLabelInProgressProjectCumulativeCountPerYear ? lastLabelInProgressProjectCumulativeCountPerYear.count : 0);
                    completedProjectsCumulativeValues.push(completedProjectCumulativeCountPerYear ? completedProjectCumulativeCountPerYear.count : lastLabelCompletedProjectCumulativeCountPerYear ? lastLabelCompletedProjectCumulativeCountPerYear.count : 0);

                    if (inProgressProjectCumulativeCountPerYear || inProgressProjectsCumulativeLastLabel == null)
                        inProgressProjectsCumulativeLastLabel = label;
                    if (completedProjectCumulativeCountPerYear || completedProjectsCumulativeLastLabel == null)
                        completedProjectsCumulativeLastLabel = label;
                })
                chartData.values = [inProgressProjectsValues, completedProjectsValues, inProgressProjectsCumulativeValues, completedProjectsCumulativeValues];
                break;

            case "chart_datasCount_base":debugger
                chartData.values = [
                    [report.baseDataCount], [report.baseDataSize.toFixed(2)]
                ]
                break;
            case "chart_datasCount_project":
                chartData.values = [
                    [report.projectDataCount, report.archiveCount],
                    [report.projectDataSize, report.archiveSize]
                ]
                break;
            case "chart_dataType_data":
            case "chart_provinceProject_data":
            case "chart_projectPhases_data":
            case "chart_projectCategories_data":
                chartData.labels = summary.map(object => object.name);
                chartData.values = summary.map(object => object.count);
                chartData.colors = summary.map(_ => this.toolsObj_basic.getRandomColor());
                break;

            case "chart_departmentUsers_user":
                chartData.labels = summary.map(object => object.departmentName);
                chartData.values = summary.map(object => object.userCount);
                chartData.colors = summary.map(_ => this.toolsObj_basic.getRandomColor());
                break;

            case "chart_groupUsers_user":
                chartData.labels = summary.map(object => object.groupName);
                chartData.values = summary.map(object => object.userCount);
                chartData.colors = summary.map(_ => this.toolsObj_basic.getRandomColor());
                break;

            case "chart_usersCount_tool":
                chartData.labels = summary.subSystemUsers.map(object => object.subsystemPersianTitle);
                chartData.values = summary.subSystemUsers.map(object => object.userCount);
                chartData.colors = summary.subSystemUsers.map(_ => this.toolsObj_basic.getRandomColor());
                break;
            case "chart_toolsCount_tool":
                chartData.labels = summary.subsystemTools.map(object => object.subsystemPersianTitle);
                chartData.values = summary.subsystemTools.map(object => object.toolCount);
                chartData.colors = summary.subsystemTools.map(_ => this.toolsObj_basic.getRandomColor());
                break;

            case "chart_interactionData_system":
            case "chart_interactionData_DIProject":
                chartData.labels = summary.transmittalCountBaseOnStatus.map(object => object.name)
                chartData.values = summary.transmittalCountBaseOnStatus.map(object => object.count)
                chartData.colors = summary.transmittalCountBaseOnStatus.map(_ => this.toolsObj_basic.getRandomColor());
                break;
            case "chart_sendData_system":
            case "chart_sendData_DIProject":
                chartData.labels = summary.dataItemRevisionCountBaseOnCategory.map(object => object.name)
                chartData.values = summary.dataItemRevisionCountBaseOnCategory.map(object => object.count)
                chartData.colors = summary.dataItemRevisionCountBaseOnCategory.map(_ => this.toolsObj_basic.getRandomColor());
                break;

            case "chart_sendDataYear_system":
                chartData.labels = summary.dataItemCountBaseOnYear.map(object => object.name)
                chartData.values = summary.dataItemCountBaseOnYear.map(object => object.count)
                break;
            case "chart_recordedDataYear_system":
                chartData.labels = [
                    ...new Set(
                        [...summary.transmittalCountBaseOnYear.map(object => object.name),
                        ...summary.commentSheetCountBaseOnYear.map(object => object.name),
                        ...summary.replySheetCountBaseOnYear.map(object => object.name)
                        ]
                    )
                ]
                chartData.values = [
                    summary.transmittalCountBaseOnYear.map(object => object.count),
                    summary.commentSheetCountBaseOnYear.map(object => object.count),
                    summary.replySheetCountBaseOnYear.map(object => object.count)
                ]
                break;

            case "chart_acDelay_DIProject":
                chartData.labels = summary.adviserDeadline.map(object => perConverter[object.name])
                chartData.values = summary.adviserDeadline.map(object => object.count)
                break;

            case "chart_suDelay_DIProject":
                chartData.labels = summary.supervisorDeadline.map(object => perConverter[object.name])
                chartData.values = summary.supervisorDeadline.map(object => object.count)
                break;
        }
        return chartData;
    }
}