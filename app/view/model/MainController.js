Ext.define('App.view.model.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.model-main',

    onAddClick : function (){
    	console.log('onAddClick')
    },

    uploadOnClick : function(){
    	console.log('uploadOnClick')
        Ext.create('Ext.window.Window', {
            // title: 'CHART',
            height: 600,
            width: 1100,
            maximizable : true,
            layout: 'fit',
            modal :true,
            // frame: true,
            items: [{
                xtype : 'model_upload_form',
                //set viewModel here
            }]
        }).show();
    },

    onSendFile : function (button){
        // return ;
        var form = button.up('form').getForm();
        // console.log(form)
        // return ;
        if(form.isValid()) {
            form.submit({
                url: 'http://'+App.util.Config.hostname()+'/big/public/api/models/upload',
                waitMsg: 'Processing...',
                success: function(fp, o) {
                    Ext.Msg.alert('Success', o.result );
                },
                failure: function(fp, o){
                    console.log({
                        fp, o
                    })
                    Ext.Msg.alert('failure', o.result );

                }
            });
        }
    },

    processOnClick : function (){
        console.log('processOnClick')
        let self = this;

        var myMask = new Ext.LoadMask({
            msg    : 'Please wait...',
            target : self.getView()
        });

        myMask.show();

        Ext.Ajax.request({
            url: 'http://'+App.util.Config.hostname()+'/big/public/api/models/process',
            method: 'POST',
            /*params: {
                token : token
            },*/
            success: function (response, opts){
                console.log('success')
                console.log({
                    response, opts
                })
                myMask.hide();
                Ext.getStore('Mastermodels').load();
            },
            failure : function(response, opts){
                console.log('failure')
                console.log({
                    response, opts
                })
                myMask.hide();
            }
        })
    },

    onSearch : function (component, e){
    	if (e.keyCode == 13) {
    		store = Ext.getStore('Mastermodels') //this.getViewModel().getStore('tools');
            self = this;
            params = this.getElementValue();
    		
    		/*console.log({
    			store,
    			params
    		})*/

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

    getElement : function(){
    	return {
    		search_by_name : Ext.ComponentQuery.query('textfield[name=search_by_name_model]')[0],
			search_by_pwbno: Ext.ComponentQuery.query('textfield[name=search_by_pwbno_model]')[0],
			search_by_pwbname: Ext.ComponentQuery.query('textfield[name=search_by_pwbname_model]')[0],
			search_by_process: Ext.ComponentQuery.query('textfield[name=search_by_process_model]')[0],
			search_by_code: Ext.ComponentQuery.query('textfield[name=search_by_code_model]')[0],
            search_by_cavity: Ext.ComponentQuery.query('textfield[name=search_by_cavity_model]')[0],

    	};
    },

    getElementValue : function (){
    	var elements = this.getElement();

    	var elementsValue = {
    		name: elements.search_by_name.value,
    		pwbno: elements.search_by_pwbno.value,
    		pwbname: elements.search_by_pwbname.value,
    		process: elements.search_by_process.value,
    		code: elements.search_by_code.value,
            cavity : elements.search_by_cavity.value,
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
    }

});