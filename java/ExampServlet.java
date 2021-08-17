import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class ExampServlet extends HttpServlet
{

   public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
   throws ServletException, IOException
   {
      response.setContentType("text/html");
      PrintWriter out = response.getWriter();
      out.println("<title>Example</title>" +
                  "<body bgcolor=FFFFFF>");

      out.println("<h2>Button Clicked</h2>");

      String DATA = request.getParameter("DATA");

      if(DATA != null)
      {
         out.println(DATA);
      }
      else
      {
         out.println("No text entered.");
      }

      out.println("<P>Return to <A HREF=../simpleHTML.html>Form</A>");
      out.close();
   }
}
