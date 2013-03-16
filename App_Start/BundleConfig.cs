using System.Web.Optimization;

namespace BoringChatService
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/jquery.colorbox.js"));

            bundles.Add(new ScriptBundle("~/bundles/bcs").Include(
                        //"~/Scripts/leaflet.js",
                        "~/Scripts/flickr.js",
                        "~/Scripts/map.js",
                        "~/Scripts/chat.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/main.css",
                "~/Content/colorbox.css"));
        }
    }
}