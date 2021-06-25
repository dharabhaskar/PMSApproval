sap.ui.define([
	"com/infocus/PMSApproval/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/List',
	'sap/m/StandardListItem',
	'sap/m/Label',
	'sap/m/Text',
	'sap/m/TextArea',
	'sap/ui/layout/HorizontalLayout',
	'sap/ui/layout/VerticalLayout'
], function(Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox,
	Fragment, Button, Dialog, List, StandardListItem, Label, Text, TextArea, HorizontalLayout, VerticalLayout) {
	"use strict";
	return Controller.extend("com.infocus.PMSApproval.controller.DetailView", {
		onInit: function() {
			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.subscribe("DetailView", "ShowDetailView", this.onShowDetailView, this);

			//Show the floating footer...
			var oObjectPage = this.getView().byId("ObjectPageLayout");
			oObjectPage.setShowFooter(true);
			
			console.log("Inside detail view....");
		},
		onShowDetailView: function(source, event, data) {
			MessageBox.show("Showing data for:" + data.empName)
		},
		onDesignationPress: function() {
			var that = this;
			if (!that.resizableDialog) {
				var oTable = new sap.m.Table("tab-pos", {
					inset: true,
					mode: sap.m.ListMode.None,
					includeItemInSelection: false,
				});
				var col1 = new sap.m.Column("col1-pos", {
					header: new sap.m.Label({
						text: "Position"
					})
				});
				var col2 = new sap.m.Column("col2-pos", {
					header: new sap.m.Label({
						text: "Period"
					})
				});
				var col3 = new sap.m.Column("col3-pos", {
					header: new sap.m.Label({
						text: "Location"
					})
				});

				oTable.bindItems("positions>/results", new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
						text: "{positions>Position}"
					}), new sap.m.Text({
						text: "{positions>Period}"
					}), new sap.m.Text({
						text: "{positions>Location}",
					}), ]
				}));

				oTable.addColumn(col1);
				oTable.addColumn(col2);
				oTable.addColumn(col3);

				that.resizableDialog = new Dialog({
					title: 'Details of last three position (Excluding Present)',
					contentWidth: "650px",
					contentHeight: "200px",
					resizable: true,
					content: oTable,
					beginButton: new Button({
						text: 'Close',
						press: function() {
							that.resizableDialog.close();
						}
					})
				});

				//to get access to the global model
				this.getView().addDependent(that.resizableDialog);
			}

			that.resizableDialog.open();
		},
		onEditToggleButtonPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
		},
		handleSaveAppraisalPress: function() {
			//Calling the save data function.
			this._oPopover.close();

		},
		handleCancelAppraisalPress: function() {
			this._oPopover.close();
		},
		handleSaveAsDraft: function() {

		},
		onAgreeSelectionChanged: function(oEvent) {
			this.IAgreeCheckboxSelected = oEvent.getParameters().selected;
			this.byId("agree").setEnabled(this.IAgreeCheckboxSelected);
		},
		handleIAgreePopoverPress: function(oEvent) {
			//console.log(oEvent);
			var oButton = oEvent.getSource(),
				oView = this.getView();

			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment(oView.getId(), "com.infocus.PMSApproval.view.AgreePopover", this)
				oView.addDependent(this._oPopover);
			}

			this._oPopover.openBy(oButton);
		},
		onSubmitDialogPress: function() {
			var _self = this;
			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new Dialog({
					type: sap.m.DialogType.Message,
					title: "Confirm",
					content: [
						/*new Label({
							text: "Do you want to submit this order?",
							labelFor: "submissionNote"
						}),*/
						new sap.m.CheckBox("checkbox1", {
							width: "100%",
							text: "I agree to save the self appraisal for the approval",
							select: function(oEvent) {
								this.oSubmitDialog.getBeginButton().setEnabled(oEvent.getParameters().selected);
							}.bind(this)
						})
					],
					beginButton: new Button({
						type: sap.m.ButtonType.Emphasized,
						text: "Submit",
						enabled: false,
						press: function() {

							MessageToast.show("Note is: ");
							this.oSubmitDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function() {
							this.oSubmitDialog.close();
						}.bind(this)
					})
				});
			}

			this.oSubmitDialog.open();
		},
		onExit: function() {
			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.unsubscribe("DetailView", "ShowDetailView", this.onShowDetailView, this);

			//Clean up the popovers...
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		}
	});
});