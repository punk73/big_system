Ext.define('App.view.schedule.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.schedule-main',

    onAddClick : function (){
    	console.log('onAddClick')
    },

    uploadOnClick : function(){
    	console.log('uploadOnClick')
        var form;
        if (form == undefined ) {
            form = Ext.create('Ext.window.Window', {
                title: 'Upload Form',
                height: 300,
                width: 600,
                maximizable : true,
                layout: 'fit',
                modal :true,
                // frame: true,
                items: [{
                    xtype : 'schedule_upload_form',
                    //set viewModel here
                }]
            })    
        }

        form.show();
    },

    onSendFile : function (button){
        // return ;
        var form = button.up('form').getForm();
        // console.log(form)
        // return ;
        if(form.isValid()) {
            form.submit({
                url: 'http://'+App.util.Config.hostname()+'/big/public/api/schedule_details/upload',
                waitMsg: 'Processing...',
                success: function(fp, o) {
                    console.log({
                        fp, o
                    })
                    Ext.Msg.alert('Success', o.result.message );
                    Ext.getStore('Schedules').load();
                },
                failure: function(fp, o){
                    console.log({
                        fp, o
                    })

                    if (o.result.error) {
                        var message = o.result.error.message 
                        + '.<br> please screenshot & Call IT Team if you need help';
                        Ext.Msg.alert('failure', message );
                    }

                }
            });
        }
    },

    processOnClick (){
        console.log('processOnClick')
        Ext.Ajax.request({
            url: 'http://'+App.util.Config.hostname()+'/big/public/api/schedule_details/preprocess',
            method: 'GET',
            success: function (response, opts){

                var result = JSON.parse(response.responseText);
                // console.log(result)
                // jika belum digenerate baru.
                if (!result.is_generated) {
                    var form;
                    if (form == undefined ) {
                        form = Ext.create('Ext.window.Window', {
                            title: 'Process Form',
                            height: 300,
                            width: 400,
                            maximizable : true,
                            layout: 'fit',
                            modal :true,
                            // frame: true,
                            items: [{
                                xtype : 'schedule_process_form',
                                margin: '0',
                                //set viewModel here
                            }]
                        }).show();
                    }
                    form.show();
                }else{
                    Ext.Msg.alert('Info', result.message)
                }
                
            },
            failure : function(response, opts){
                console.log('failure')
                console.log({
                    response, opts
                })
                
                Ext.Msg.alert('Info', 'Upps!! something went wrong.' );

                
            }
        })

        
    },

    processOnClickObsolette : function (){
    	console.log('processOnClick')
        let self = this;

        var myMask = new Ext.LoadMask({
            msg    : 'Please wait...',
            target : self.getView()
        });

        myMask.show();

        Ext.Ajax.request({
            url: 'http://'+App.util.Config.hostname()+'/big/public/api/schedule_details/process',
            method: 'POST',
            /*params: {
                token : token
            },*/
            success: function (response, opts){
                console.log('success')
                console.log({
                    response, opts
                })
                Ext.getStore('Schedules').load();
                myMask.hide();
            },
            failure : function(response, opts){
                console.log('failure')
                console.log({
                    response, opts
                })

                Ext.Msg.alert('Info', 'Upps!! something went wrong.' );

                myMask.hide();
            }
        })
    },

    getElement : function (){
        return {
            search_by_name : Ext.ComponentQuery.query('textfield[name=search_by_name]')[0],
            search_by_pwbno  : Ext.ComponentQuery.query('textfield[name=search_by_pwbno]')[0],
            search_by_pwbname : Ext.ComponentQuery.query('textfield[name=search_by_pwbname]')[0],
            search_by_process : Ext.ComponentQuery.query('textfield[name=search_by_process]')[0],
            search_by_code : Ext.ComponentQuery.query('textfield[name=search_by_code]')[0],
            search_by_prod_no : Ext.ComponentQuery.query('textfield[name=search_by_prod_no]')[0],
            search_by_rev_date : Ext.ComponentQuery.query('textfield[name=search_by_rev_date]')[0],
            search_by_line : Ext.ComponentQuery.query('textfield[name=search_by_line]')[0],
            search_by_lot_size : Ext.ComponentQuery.query('textfield[name=search_by_lot_size]')[0],
            search_by_seq_start : Ext.ComponentQuery.query('textfield[name=search_by_seq_start]')[0],
            search_by_seq_end : Ext.ComponentQuery.query('textfield[name=search_by_seq_end]')[0],
            search_by_start_serial : Ext.ComponentQuery.query('textfield[name=search_by_start_serial]')[0],
        }
    },

    getElementValue : function (){
        var elements = this.getElement();

        var elementsValue = {
            name: elements.search_by_name.value,
            pwbno: elements.search_by_pwbno.value,
            pwbname: elements.search_by_pwbname.value,
            process: elements.search_by_process.value,
            code : elements.search_by_code.value,
            prod_no : elements.search_by_prod_no.value,
            rev_date : elements.search_by_rev_date.value,
            line : elements.search_by_line.value,
            lot_size : elements.search_by_lot_size.value,
            seq_start : elements.search_by_seq_start.value,
            seq_end : elements.search_by_seq_end.value,
            start_serial : elements.search_by_start_serial.value,

        }

        // return elementsValue;

        let result = {}
        var key;
        for (key in elementsValue){
            if (elementsValue[key] != '' && elementsValue[key] != null  ) {
                result[key] = elementsValue[key]
            }
        }

        return result;
    },

    onSearch : function (component, e){
        if (e.keyCode == 13) {
            store = Ext.getStore('Schedules') //this.getViewModel().getStore('tools');
            self = this;
            params = this.getElementValue();
            
            console.log({
                store,
                params
            })

            store.load({
                params: params,
                callback: function(records,operation,success){
                    console.log({
                        records, operation, success
                    })
                    /*if(model != null){
                        
                    }else{
                        const message = 'Tool Number not found!<br>please recheck for typo or kindly contact JEIN for support';
                        Ext.Msg.alert('Info', message );
                        element.no.focus();
                        return;
                    }*/
                }
            })
            
        }
    },

    onProcessSubmit(){
        console.log('onProcessSubmit')
        
    },

});
