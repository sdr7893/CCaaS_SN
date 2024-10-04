(() => {
  ["use strict"];
  ({
    973: function (e, n) {
      var t =
        (this && this.__awaiter) ||
        function (e, n, t, o) {
          return new (t || (t = Promise))(function (c, r) {
            function i(e) {
              try {
                a(o.next(e));
              } catch (e) {
                r(e);
              }
            }
            function s(e) {
              try {
                a(o.throw(e));
              } catch (e) {
                r(e);
              }
            }
            function a(e) {
              var n;
              e.done
                ? c(e.value)
                : ((n = e.value),
                  n instanceof t
                    ? n
                    : new t(function (e) {
                        e(n);
                      })).then(i, s);
            }
            a((o = o.apply(e, n || [])).next());
          });
        };
      Object.defineProperty(n, "__esModule", { value: !0 }),
        (n.CUSTOMERDATAENUM = void 0),
        (n.CUSTOMERDATAENUM = {
          PHONENUMBER: "phonenumber",
          EMAIL: "email",
          NAME: "name",
        });
      const o = "Contact",
        c = "Account";
      class r {
        constructor(e) {
          if (!e)
            throw new Error("ccaaSSDKInstance cannot be null or undefined");
          this.ccaaSSDKInstance = e;
        }
        initialize() {
          if (void 0 === window.sforce || void 0 === window.sforce.opencti) {
            const e = "/support/api/54.0/lightning/opencti.js",
              n = `${new URL(document.referrer).origin}${e}`;
            return r.loadScript(n);
          }
          return Promise.resolve(!0);
        }
        conversationReady(e) {
          return t(this, void 0, void 0, function* () {
            return new Promise((n, o) =>
              t(this, void 0, void 0, function* () {
                const n =
                  yield this.ccaaSSDKInstance.conversation.getConversationData(
                    e.conversationId,
                    ["msdyn_isoutbound", "msdyn_channel", "subject"]
                  );
                let t = window.sforce.opencti.CALL_TYPE.INBOUND;
                n.msdyn_channel &&
                  ((19237e4 !== Number(n.msdyn_channel) &&
                    19244e4 !== Number(n.msdyn_channel)) ||
                    (n.msdyn_isoutbound &&
                      (t = window.sforce.opencti.CALL_TYPE.OUTBOUND)));
                const { contactId: o, accountId: c } =
                  yield r.getContactOrAccountId(e, t);
                (this.contactId = o),
                  (this.accountId = c),
                  (this.contactId || this.accountId) &&
                    r.screenPop(this.contactId || this.accountId);
              })
            );
          });
        }
        endConversation() {
          return t(this, void 0, void 0, function* () {
            throw new Error("Method is not defined.");
          });
        }
        onClickToDial(e) {
          window.sforce.opencti.enableClickToDial(),
            window.sforce.opencti.onClickToDial({
              listener: (n) => {
                const t = {
                  number: n.number,
                  objectType: n.objectType,
                  recordId: n.recordId,
                  recordName: n.recordName,
                };
                e(t), this.setSoftPhonePanelVisibility(!0);
              },
            });
        }
        setSoftPhonePanelVisibility(e = !0) {
          e !==
            window.sforce.opencti.isSoftphonePanelVisible({
              callback: (e) => {
                if (e.success) return e.returnValue.visible;
                throw new Error(e.errors);
              },
            }) &&
            window.sforce.opencti.setSoftphonePanelVisibility({ visible: e });
        }
        setSoftPhonePanelWidth(e) {
          window.sforce.opencti.setSoftphonePanelWidth({ widthPX: e });
        }
        setSoftPhonePanelHeight(e) {
          window.sforce.opencti.setSoftphonePanelHeight({ heightPX: e });
        }
        static screenPop(e) {
          return new Promise((n, t) => {
            window.sforce.opencti.screenPop({
              type: window.sforce.opencti.SCREENPOP_TYPE.SOBJECT,
              params: { recordId: e },
              callback: (e) => {
                e.success ? n(e.success) : t(e.errors);
              },
            });
          });
        }
        static searchForRecords(e, n) {
          return t(this, void 0, void 0, function* () {
            return new Promise((t, r) => {
              window.sforce.opencti.searchAndScreenPop({
                searchParams: e,
                callType: n,
                deferred: !0,
                callback: (e) => {
                  const n = [];
                  if (e.success && e.returnValue) {
                    for (const [t, r] of Object.entries(e.returnValue))
                      !r ||
                        (r.RecordType !== o && r.RecordType !== c) ||
                        n.push({ id: t, type: r.RecordType });
                    t(n);
                  } else r(e.errors);
                },
              });
            });
          });
        }
        static getContactOrAccountId(e, n) {
          return t(this, void 0, void 0, function* () {
            const t = new Set(),
              i = new Set(),
              s = yield r.getRecords(e, n);
            return (
              s &&
                s.forEach(({ id: e, type: n }) => {
                  n === o ? t.add(e) : n === c && i.add(e);
                }),
              {
                contactId: 1 === t.size ? t.values().next().value : void 0,
                accountId: 1 === i.size ? i.values().next().value : void 0,
              }
            );
          });
        }
        static getRecords(e, o) {
          return t(this, void 0, void 0, function* () {
            const t = e.customerData;
            let c = [];
            try {
              return (
                r.checkIfNotEmtpy(n.CUSTOMERDATAENUM.PHONENUMBER, t)
                  ? (c = yield r.searchForRecords(t.phonenumber, o))
                  : r.checkIfNotEmtpy(n.CUSTOMERDATAENUM.EMAIL, t)
                  ? (c = yield r.searchForRecords(t.email, o))
                  : r.checkIfNotEmtpy(n.CUSTOMERDATAENUM.NAME, t) &&
                    (c = yield r.searchForRecords(t.name, o)),
                c
              );
            } catch (e) {
              throw new Error(e);
            }
          });
        }
        static checkIfNotEmtpy(e, n) {
          return void 0 !== n[e] && null !== n[e] && "" !== n[e];
        }
        static loadScript(e) {
          return new Promise((n, t) => {
            const o = document.createElement("script");
            (o.type = "text/javascript"),
              (o.async = !0),
              (o.src = e),
              (o.onload = function () {
                n(!0);
              }),
              (o.onerror = function () {
                t(new Error(`Error in loading ${e}`));
              }),
              document.getElementsByTagName("head")[0].appendChild(o);
          });
        }
      }
      (window.CCaaS = window.CCaaS || {}),
        window.CCaaS.CTIDriver || (window.CCaaS.CTIDriver = r),
        (n.default = r);
    },
  })[973](0, {});
})();
